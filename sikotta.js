<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Firebaseの設定
const firebaseConfig = {
  apiKey: "AIzaSyCjruHCFsMJ2bkQmzcLAeeDMmcjTSzc9kA",
  authDomain: "sikobutton.firebaseapp.com",
  projectId: "sikobutton",
  storageBucket: "sikobutton.firebasestorage.app",
  messagingSenderId: "1014167519503",
  appId: "1:1014167519503:web:11dae1bf0cbf729706fe7a",
  measurementId: "G-JZ8EEDMS0J"
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestoreにカウントを保存する関数
async function updateSikottaCount(articleId) {
  const docRef = doc(db, "sikottaCounts", articleId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await updateDoc(docRef, { count: increment(1) });
  } else {
    await setDoc(docRef, { count: 1 });
  }

  // 最新のカウントを取得して表示更新
  const updatedDoc = await getDoc(docRef);
  document.getElementById(`sikotta-count-${articleId}`).innerText = updatedDoc.data().count;
}

// Firestoreからカウントを取得して表示
async function loadSikottaCounts(articleId) {
  const docRef = doc(db, "sikottaCounts", articleId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    document.getElementById(`sikotta-count-${articleId}`).innerText = docSnap.data().count;
  } else {
    document.getElementById(`sikotta-count-${articleId}`).innerText = "0";
  }
}

// ボタンが押されたらカウントを増やす
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".sikotta-button").forEach(button => {
    const articleId = button.dataset.articleId;
    loadSikottaCounts(articleId); // ページ読み込み時にカウントを取得

    button.addEventListener("click", function () {
      updateSikottaCount(articleId);
    });
  });
});
</script>