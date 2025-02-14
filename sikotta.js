// Firebase SDKをCDNから読み込む
if (typeof firebase === "undefined") {
    var script = document.createElement("script");
    script.src = "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
    script.onload = function () {
        var firestoreScript = document.createElement("script");
        firestoreScript.src = "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
        firestoreScript.onload = initFirebase;
        document.head.appendChild(firestoreScript);
    };
    document.head.appendChild(script);
} else {
    initFirebase();
}

function initFirebase() {
    // Firebase 設定
    const firebaseConfig = {
  apiKey: "AIzaSyCjruHCFsMJ2bkQmzcLAeeDMmcjTSzc9kA",
  authDomain: "sikobutton.firebaseapp.com",
  projectId: "sikobutton",
  storageBucket: "sikobutton.firebasestorage.app",
  messagingSenderId: "1014167519503",
  appId: "1:1014167519503:web:11dae1bf0cbf729706fe7a",
    };

    // Firebase 初期化
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // ボタンを探して処理を設定
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".sikotta-button").forEach(button => {
            const articleId = button.getAttribute("data-article-id");
            if (!articleId) {
                console.error("記事IDが取得できませんでした");
                return;
            }

            console.log(`記事ごとのID: ${articleId}`);

            // Firestoreのカウントを読み込む
            loadSikottaCounts(articleId);

            // クリックイベント設定
            button.addEventListener("click", async function () {
                console.log(`ボタンがクリックされました！ 記事ID: ${articleId}`);
                await updateSikottaCount(articleId);
                loadSikottaCounts(articleId);
            });
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
            document.querySelectorAll(`[data-article-id="${articleId}"] .sikotta-count`).forEach(el => {
                el.innerText = docSnap.data().count;
            });
        } else {
            document.querySelectorAll(`[data-article-id="${articleId}"] .sikotta-count`).forEach(el => {
                el.innerText = "0";
            });
        }
    }
}
