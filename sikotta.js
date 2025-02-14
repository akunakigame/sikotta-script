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
        apiKey: "あなたのAPIキー",
        authDomain: "あなたのAuthドメイン",
        projectId: "あなたのプロジェクトID",
        storageBucket: "あなたのストレージバケット",
        messagingSenderId: "あなたのメッセージングID",
        appId: "あなたのアプリID"
    };

    // Firebase 初期化
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // **記事ごとの一意なIDを生成**
    function generateArticleId() {
        let url = window.location.pathname; // 記事ページのURLを取得
        return url.replace(/[^a-zA-Z0-9]/g, ""); // 記号を削除してID化
    }

    document.addEventListener("DOMContentLoaded", function () {
        const articleId = generateArticleId();
        console.log(`生成された記事ID: ${articleId}`);

        document.querySelectorAll(".sikotta-button").forEach(button => {
            button.setAttribute("data-article-id", articleId); // ボタンにIDを設定
            loadSikottaCounts(articleId); // Firestoreからカウントを取得

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
            const countValue = docSnap.data().count;
            document.querySelectorAll(".sikotta-count").forEach(el => {
                el.innerText = countValue;
            });
        } else {
            document.querySelectorAll(".sikotta-count").forEach(el => {
                el.innerText = "0";
            });
        }
    }
}
