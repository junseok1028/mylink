import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { LinkItem, Profile } from './types';
import { INITIAL_LINKS } from './storage';

// Firestore collection path specified: users/anonymous/links
export const ANONYMOUS_LINKS_COLLECTION = 'users/anonymous/links';

export function getLinksCollectionRef() {
  return collection(db, 'users', 'anonymous', 'links');
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
 * 경로: users/anonymous/links
 */
export async function addLinkToFirestore(
  link: Omit<LinkItem, 'id'> & { id?: string }
): Promise<LinkItem> {
  const collectionRef = getLinksCollectionRef();
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
 * Firestore의 users/anonymous/links 문서들을 실시간 구독합니다.
 */
export function subscribeToLinks(
  onSuccess: (links: LinkItem[]) => void,
  onError?: (error: unknown) => void
): () => void {
  const collectionRef = getLinksCollectionRef();
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
      console.error('Firestore subscribeToLinks error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Firestore의 users/anonymous/links 모든 문서를 1회 가져옵니다.
 * createAt 기준 최신순(내림차순)으로 정렬됩니다.
 */
export async function getLinksFromFirestore(): Promise<LinkItem[]> {
  const collectionRef = getLinksCollectionRef();
  let snapshot;

  try {
    // 1차 시도: Firestore query orderBy('createAt', 'desc')
    const q = query(collectionRef, orderBy('createAt', 'desc'));
    snapshot = await getDocs(q);
  } catch (queryErr) {
    // 색인 미생성 또는 필드 부재 대비 fallback
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

  // createAt 기준 최신순(내림차순) 정렬 보장
  items.sort((a, b) => {
    const timeA = getTimestampMillis(a.createAt || a.createdAt);
    const timeB = getTimestampMillis(b.createAt || b.createdAt);
    return timeB - timeA;
  });

  return items;
}

/**
 * Firestore 문서 삭제
 */
export async function deleteLinkFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, 'users', 'anonymous', 'links', id);
  await deleteDoc(docRef);
}

/**
 * Firestore 문서 업데이트
 */
export async function updateLinkInFirestore(
  id: string,
  updates: Partial<Omit<LinkItem, 'id'>>
): Promise<void> {
  const docRef = doc(db, 'users', 'anonymous', 'links', id);
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
 * 프로필 정보 조회 (users/anonymous/metadata/profile)
 */
export async function getProfileFromFirestore(): Promise<Profile | null> {
  try {
    const docRef = doc(db, 'users', 'anonymous', 'metadata', 'profile');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as Profile;
    }
  } catch (err) {
    console.warn('getProfileFromFirestore error:', err);
  }
  return null;
}

/**
 * 프로필 정보 저장 (users/anonymous/metadata/profile)
 */
export async function saveProfileToFirestore(profile: Profile): Promise<void> {
  try {
    const docRef = doc(db, 'users', 'anonymous', 'metadata', 'profile');
    await setDoc(docRef, profile, { merge: true });
  } catch (err) {
    console.warn('saveProfileToFirestore error:', err);
  }
}

/**
 * 만약 Firestore에 기존 링크가 전혀 없다면, 기존 기본 링크를 Firestore에 마이그레이션(초기화)합니다.
 */
export async function seedInitialLinksIfEmpty(): Promise<boolean> {
  try {
    const current = await getLinksFromFirestore();
    if (current.length === 0) {
      for (const item of INITIAL_LINKS) {
        await addLinkToFirestore(item);
      }
      return true;
    }
  } catch (error) {
    console.warn('seedInitialLinksIfEmpty failed (likely permissions or offline):', error);
  }
  return false;
}
