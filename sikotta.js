// FirestoreとFirebaseの初期化（すでに入れてあるなら不要）
const firebaseConfig = {
  apiKey: "AIzaSyCjruHCFsMJ2bkQmzcLAeeDMmcjTSzc9kA",
  authDomain: "sikobutton.firebaseapp.com",
  projectId: "sikobutton",
  storageBucket: "sikobutton.firebasestorage.app",
  messagingSenderId: "1014167519503",
  appId: "1:1014167519503:web:11dae1bf0cbf729706fe7a",
  measurementId: "G-JZ8EEDMS0J"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".sikotta-button");
    if (!button) return;

    // 記事のURLから一意のIDを生成
    const articleId = "sikotta-" + location.pathname.replace(/\//g, "-").replace(".html", "");

    console.log(`記事ごとのID: ${articleId}`);

    // Firestoreのカウントを読み込む
    loadSikottaCounts(articleId);

    // ボタンクリック時の処理
    button.addEventListener("click", async function () {
        console.log(`ボタンがクリックされました！ 記事ID: ${articleId}`);
        await updateSikottaCount(articleId);
        loadSikottaCounts(articleId);
    });
});

// Firestoreにカウントを保存
async function updateSikottaCount(articleId) {
    const docRef = db.collection("sikottaCounts").doc(articleId);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
        await docRef.update({ count: firebase.firestore.FieldValue.increment(1) });
    } else {
        await docRef.set({ count: 1 });
    }
}

// Firestoreからカウントを取得
async function loadSikottaCounts(articleId) {
    const docRef = db.collection("sikottaCounts").doc(articleId);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
        document.getElementById("sikotta-count").innerText = docSnap.data().count;
    } else {
        document.getElementById("sikotta-count").innerText = "0";
    }
}
