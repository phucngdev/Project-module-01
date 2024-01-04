import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Thông tin của dự án firebase
const firebaseConfig = {
  apiKey: "AIzaSyAiPqOgweH9wpmKEjBgI09YCpKan14Puko",
  authDomain: "module-1-62bdd.firebaseapp.com",
  projectId: "module-1-62bdd",
  storageBucket: "module-1-62bdd.appspot.com",
  messagingSenderId: "843174635266",
  appId: "1:843174635266:web:b972f8509eb4cd4c6b041b",
};

// Tạo biến toàn cục cho phép sử dụng firebase
const app = initializeApp(firebaseConfig);
// Tạo kho lưu trữ chung
const storage = getStorage(app);

// thiết kế uploadFile, có tham số truyền vào là giá trị lấy từ input , kết quả trả về sẽ là url sau khi upload
async function upload(file) {
  // Lấy giá trị từ input
  const fileObj = file.files[0];
  let fileUrl = "";
  if (fileObj) {
    // Tham chiếu đến thư mục chứa hình ảnh
    const storageRef = ref(storage, `uploads/${fileObj.name}`);
    // xử lý quá trình upload
    try {
      const snapshort = await uploadBytes(storageRef, fileObj);
      // Lấy link hình ảnh từ firebase
      const downloadUrl = await getDownloadURL(snapshort.ref);
      // Gán lại giá trị của link hình ảnh vào biến fileUrl
      fileUrl = downloadUrl;
    } catch (error) {
      console.log("Đã có lỗi xảy ra");
    }
  } else {
    console.log("Tên hình ảnh không được để trống");
  }
  // Trả về kết quả của hàm là link ảnh
  return fileUrl;
}

export default upload;
