import { LitElement, html } from 'lit';
import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs } from "firebase/firestore"

export class WcFirestore extends LitElement {
  static get properties() {
    return {
      data: { type: Array },
    };
  }
  constructor() {
    super();
    const firebaseApp = initializeApp({
      apiKey: process.env.FIREBASE_API_KEY,
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    this.data = [];
  }

  async connectedCallback() {
    super.connectedCallback();
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, "collection"));
    this.data = querySnapshot.docs;
  }

  render() {
    return html`<div>${this.data.map((d) => {
      const data = d.data();
      return html`
      <video controls poster="${data['video-cover']}">
        <source src="${data['video-downloadAddr']}" type="video/mp4">
      </video>`;
    })}</div>`;
  }
}
