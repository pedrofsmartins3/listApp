import React, { useEffect } from "react";
import logo from "./assets/shopping.png";
import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  deleteDoc,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxcn_y3FPTnS23PP16mw2O3SmNYLFJk5U",
  authDomain: "listacompras-f6959.firebaseapp.com",
  projectId: "listacompras-f6959",
};

const app = initializeApp(firebaseConfig);

export default function App() {
  const [item, setItem] = React.useState("");
  const [list, setList] = React.useState([]);
  const [change, setChange] = React.useState(false);
  const db = getFirestore(app);
  const itemCollectionRef = collection(db, "lista");

  async function addItem() {
    try {
      const itens = await addDoc(collection(db, "lista"), {
        item,
      });
      console.log("Adicinado com sucesso,", itens);
    } catch (err) {
      console.log("Deu erro: ", err);
    }
    setChange(!change);
    setItem("");
  }

  const displayList = list.map((item) => {
    return (
      <div key={item.id} className="item-div">
        <li>{item.item}</li>
        <button className="apagar" onClick={() => deleteItem(item.id)}>
          Apagar
        </button>
      </div>
    );
  });

  React.useEffect(() => {
    const getItems = async () => {
      const data = await getDocs(itemCollectionRef);
      setList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getItems();
  }, [change]);

  async function deleteItem(id) {
    const itemDoc = doc(db, "lista", id);
    await deleteDoc(itemDoc);
    setChange(!change);
  }

  return (
    <div id="container">
      <header>
        <h1>Lista</h1>
        <img src={logo} width="40px" />
      </header>
      <input
        id="input"
        type="text"
        placeholder="O que falta?"
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />
      <input id="add-btn" onClick={addItem} placeholder="Adicionar" />
      <ul>{displayList}</ul>
    </div>
  );
}
