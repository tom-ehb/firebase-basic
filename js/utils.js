export const snapshotToArray = (querySnapshot) => {
  return querySnapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}