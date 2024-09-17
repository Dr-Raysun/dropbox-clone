import Dropzone from "@/components/Dropzone";
import { db } from "@/firebase";

import { getNextServerSession } from "../api/auth/[...nextauth]/route";
import { collection, getDocs } from "firebase/firestore";
import { FileType } from "@/typings";

const Dashboard = async () => {
  const session = await getNextServerSession();

  const docResults = await getDocs(
    collection(db, "users", session?.user?.id, "files")
  );

  const skeletonFiles: FileType[] = docResults.docs.map((doc) => ({
    id: doc.id,
    filename: doc.data().filename || doc.id,
    timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
    fullName: doc.data().fullName,
    downloadURL: doc.data().downloadURL,
    type: doc.data().type,
    size: doc.data().size,
  }));
  console.log(skeletonFiles);

  return (
    <div>
      Dashboard
      <Dropzone />
      <p>session : {JSON.stringify(session)}</p>
      <p>id {session?.user.id}</p>
    </div>
  );
};

export default Dashboard;
