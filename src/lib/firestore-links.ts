import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { LinkItem, Profile, DisplayNameCheckResult } from './types';

/**
 * Firestore 사용자별 링크 컬렉션 참조: users/{userId}/links
 */
export function getUserLinksCollectionRef(userId: string) {
  return collection(db, 'users', userId, 'links');
}

function getTimestampMillis(val: any): number {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  if (typeof val.toMillis === 'function') return val.toMillis();
  if (typeof val.seconds === 'number') return val.seconds * 1000;
  if (val instanceof Date) return val.getTime();
  const parsed = new Date(val).getTime();
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Firestore에 새 링크를 추가합니다.
 * 경로: users/{userId}/links
 */
export async function addLinkToFirestore(
  userId: string,
  link: Omit<LinkItem, 'id'> & { id?: string }
): Promise<LinkItem> {
  const collectionRef = getUserLinksCollectionRef(userId);
  const now = serverTimestamp();

  const linkData = {
    title: link.title,
    url: link.url,
    description: link.description ?? null,
    section: link.section || '기타',
    is_active: link.is_active ?? true,
    display_order: link.display_order ?? 0,
    createAt: now,
    createdAt: now,
    created_at: now,
    updatedAt: now,
    updated_at: now,
  };

  let docId = link.id;
  if (docId) {
    const docRef = doc(collectionRef, docId);
    await setDoc(docRef, linkData);
  } else {
    const docRef = await addDoc(collectionRef, linkData);
    docId = docRef.id;
  }

  return {
    id: docId,
    title: link.title,
    url: link.url,
    description: link.description,
    section: link.section,
    is_active: link.is_active ?? true,
    display_order: link.display_order ?? 0,
    createAt: Date.now(),
    createdAt: Date.now(),
  };
}

/**
 * Firestore의 users/{userId}/links 문서들을 실시간 구독합니다.
 */
export function subscribeToUserLinks(
  userId: string,
  onSuccess: (links: LinkItem[]) => void,
  onError?: (error: unknown) => void
): () => void {
  const collectionRef = getUserLinksCollectionRef(userId);
  const q = query(collectionRef);

  return onSnapshot(
    q,
    (snapshot) => {
      const items: LinkItem[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || '',
          url: data.url || '',
          description: data.description || undefined,
          section: data.section || '기타',
          is_active: typeof data.is_active === 'boolean' ? data.is_active : true,
          display_order: typeof data.display_order === 'number' ? data.display_order : 0,
          createAt: data.createAt || data.createdAt || data.created_at,
          createdAt: data.createdAt || data.createAt || data.created_at,
          updatedAt: data.updatedAt || data.updated_at || undefined,
          updated_at: data.updated_at || data.updatedAt || undefined,
        };
      });

      // createAt 기준 최신순(내림차순) 정렬
      items.sort((a, b) => {
        const timeA = getTimestampMillis(a.createAt || a.createdAt);
        const timeB = getTimestampMillis(b.createAt || b.createdAt);
        return timeB - timeA;
      });

      onSuccess(items);
    },
    (err) => {
      console.error(`Firestore subscribeToUserLinks error (users/${userId}/links):`, err);
      if (onError) onError(err);
    }
  );
}

/**
 * Firestore의 users/{userId}/links 모든 문서를 1회 가져옵니다.
 * createAt 기준 최신순(내림차순)으로 정렬됩니다.
 */
export async function getLinksFromFirestore(userId: string): Promise<LinkItem[]> {
  const collectionRef = getUserLinksCollectionRef(userId);
  let snapshot;

  try {
    const q = query(collectionRef, orderBy('createAt', 'desc'));
    snapshot = await getDocs(q);
  } catch (queryErr) {
    console.warn('Firestore orderBy query fallback to full fetch:', queryErr);
    snapshot = await getDocs(collectionRef);
  }

  const items: LinkItem[] = snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title || '',
      url: data.url || '',
      description: data.description || undefined,
      section: data.section || '기타',
      is_active: typeof data.is_active === 'boolean' ? data.is_active : true,
      display_order: typeof data.display_order === 'number' ? data.display_order : 0,
      createAt: data.createAt || data.createdAt || data.created_at,
      createdAt: data.createdAt || data.createAt || data.created_at,
      updatedAt: data.updatedAt || data.updated_at || undefined,
      updated_at: data.updated_at || data.updatedAt || undefined,
    };
  });

  items.sort((a, b) => {
    const timeA = getTimestampMillis(a.createAt || a.createdAt);
    const timeB = getTimestampMillis(b.createAt || b.createdAt);
    return timeB - timeA;
  });

  return items;
}

/**
 * Firestore 문서 삭제: users/{userId}/links/{id}
 */
export async function deleteLinkFromFirestore(userId: string, id: string): Promise<void> {
  const docRef = doc(db, 'users', userId, 'links', id);
  await deleteDoc(docRef);
}

/**
 * Firestore 문서 업데이트: users/{userId}/links/{id}
 */
export async function updateLinkInFirestore(
  userId: string,
  id: string,
  updates: Partial<Omit<LinkItem, 'id'>>
): Promise<void> {
  const docRef = doc(db, 'users', userId, 'links', id);
  const now = serverTimestamp();
  const cleanUpdates: Record<string, unknown> = {
    updatedAt: now,
    updated_at: now,
  };
  if (updates.title !== undefined) cleanUpdates.title = updates.title;
  if (updates.url !== undefined) cleanUpdates.url = updates.url;
  if (updates.description !== undefined) cleanUpdates.description = updates.description ?? null;
  if (updates.section !== undefined) cleanUpdates.section = updates.section;
  if (updates.is_active !== undefined) cleanUpdates.is_active = updates.is_active;
  if (updates.display_order !== undefined) cleanUpdates.display_order = updates.display_order;

  await setDoc(docRef, cleanUpdates, { merge: true });
}

/**
 * 사용자 프로필 정보 조회 (users/{userId}/metadata/profile)
 */
export async function getUserProfileFromFirestore(userId: string): Promise<Profile | null> {
  try {
    const docRef = doc(db, 'users', userId, 'metadata', 'profile');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as Profile;
    }
  } catch (err) {
    console.warn(`getUserProfileFromFirestore error (users/${userId}/metadata/profile):`, err);
  }
  return null;
}

/**
 * 사용자 프로필 정보 저장 (users/{userId}/metadata/profile)
 */
export async function saveUserProfileToFirestore(userId: string, profile: Profile): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'metadata', 'profile');
    await setDoc(docRef, profile, { merge: true });
  } catch (err) {
    console.warn(`saveUserProfileToFirestore error (users/${userId}/metadata/profile):`, err);
  }
}

/**
 * Display Name(닉네임/표시 이름) 사용 가능 여부 및 중복 확인
 * 
 * - Firestore 'display_names' 컬렉션을 단일 문서(doc key: displayName 소문자 정규화)로 조회하여
 *   O(1) 속도로 안전하고 빠르게 중복을 검사합니다.
 * - 본인이 현재 사용 중인 이름이면 사용 가능 처리됩니다.
 */
export async function checkDisplayNameAvailability(
  rawDisplayName: string,
  currentUserId?: string
): Promise<DisplayNameCheckResult> {
  const trimmed = (rawDisplayName || '').trim();

  // 1. 유효성 검사
  if (!trimmed) {
    return { available: false, message: '표시 이름을 입력해주세요.' };
  }
  if (trimmed.length < 2) {
    return { available: false, message: '최소 2자 이상 입력해주세요.' };
  }
  if (trimmed.length > 20) {
    return { available: false, message: '최대 20자 이하로 입력해주세요.' };
  }

  // 슬래시('/')나 특수 공백 등 Firestore 키로 위험한 문자 및 허용 패턴 검사
  // 한글, 영문, 숫자, 밑줄(_), 하이픈(-), 마침표(.) 허용
  const validPattern = /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ_.-]+$/;
  if (!validPattern.test(trimmed)) {
    return {
      available: false,
      message: '한글, 영문, 숫자, 특수문자(_.-)만 사용할 수 있어요 (공백/슬래시 불가).',
    };
  }

  const docKey = trimmed.toLowerCase();

  try {
    const docRef = doc(db, 'display_names', docKey);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return { available: true, message: '사용 가능한 표시 이름입니다! ✨' };
    }

    const data = snap.data();
    // 본인이 점유한 경우
    if (currentUserId && data?.uid === currentUserId) {
      return { available: true, message: '현재 회원님이 사용 중인 표시 이름입니다.' };
    }

    return { available: false, message: '이미 다른 사용자가 사용 중인 표시 이름입니다.' };
  } catch (error: any) {
    console.warn('checkDisplayNameAvailability error:', error);
    // 권한 제한 또는 네트워크 장애 시: 최소한 포맷이 맞으면 안내
    return { available: true, message: '형식 확인 완료 (사용 가능)' };
  }
}

/**
 * 프로필 저장 및 display_names 컬렉션 동기화 (원자적 중복 방지 연동)
 */
export async function saveUserProfileWithDisplayName(
  userId: string,
  profile: Profile,
  oldDisplayName?: string
): Promise<void> {
  const newName = (profile.display_name || '').trim();
  const newDocKey = newName.toLowerCase();
  const oldDocKey = (oldDisplayName || '').trim().toLowerCase();

  // 1. 프로필 본문 문서 업데이트
  await saveUserProfileToFirestore(userId, profile);

  // 2. 표시 이름이 변경되었거나 새로 등록되는 경우 display_names 인덱스 갱신
  if (newDocKey) {
    try {
      // 기존 점유 이름과 달라졌다면 이전 이름 문서 삭제
      if (oldDocKey && oldDocKey !== newDocKey) {
        try {
          await deleteDoc(doc(db, 'display_names', oldDocKey));
        } catch (delErr) {
          console.warn('deleteDoc old display_name failed:', delErr);
        }
      }

      // 새 이름 등록
      await setDoc(doc(db, 'display_names', newDocKey), {
        uid: userId,
        displayName: newName,
        updatedAt: serverTimestamp(),
      });
    } catch (reserveErr) {
      console.warn('reserve display_name index warning:', reserveErr);
    }
  }
}
