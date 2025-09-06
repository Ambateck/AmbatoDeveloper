import { Injectable, NgZone, Injector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, serverTimestamp, query, orderBy, updateDoc, Timestamp } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from "@angular/fire/storage";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore, private zone: NgZone, private storage: Storage, private injector: Injector) { 
  }

  // Design Requests
  agregarSolicitudDiseno(request: any) {
    return this.zone.run(() => {
      const designRequestsCollection = collection(this.firestore, 'design-requests');
      return addDoc(designRequestsCollection, request);
    });
  }

  getDesignRequests(): Observable<any[]> {
    return this.zone.run(() => {
      const designRequestsCollection = collection(this.firestore, 'design-requests');
      const q = query(designRequestsCollection, orderBy('fecha', 'desc'));
      return collectionData(q, { idField: 'id' });
    });
  }

  updateDesignRequestStatus(id: string, status: string) {
    return this.zone.run(() => {
      const requestDoc = doc(this.firestore, 'design-requests', id);
      return updateDoc(requestDoc, { estado: status });
    });
  }

  deleteDesignRequest(id: string) {
    return this.zone.run(() => {
      const requestDoc = doc(this.firestore, 'design-requests', id);
      return deleteDoc(requestDoc);
    });
  }

  // CV Uploads
  uploadCv(file: File, userId: string, filePath: string): Promise<any> {
    return this.zone.run(() => {
      const storageRef = ref(this.storage, filePath);
      return uploadBytes(storageRef, file).then(snapshot => {
        return getDownloadURL(snapshot.ref).then(downloadURL => {
          const cvCollection = collection(this.firestore, 'cv-uploads');
          return addDoc(cvCollection, {
            userId,
            filePath,
            downloadURL,
            uploadedAt: serverTimestamp()
          });
        });
      });
    });
  }

  getCvUploads(): Observable<any[]> {
    return this.zone.run(() => {
      return runInInjectionContext(this.injector, () => {
        const cvCollection = collection(this.firestore, 'cv-uploads');
        return collectionData(cvCollection, { idField: 'id' });
      });
    });
  }

  deleteCvUpload(id: string, filePath: string) {
    return this.zone.run(() => {
      const cvDoc = doc(this.firestore, 'cv-uploads', id);
      const storageRef = ref(this.storage, filePath);
      return deleteObject(storageRef).catch(error => {
        if (error.code === 'storage/object-not-found') {
          return;
        }
        throw error;
      }).then(() => {
        return deleteDoc(cvDoc);
      });
    });
  }

  // Ideas
  addIdea(idea: { text: string }) {
    return this.zone.run(() => {
      const ideasCollection = collection(this.firestore, 'ideas');
      return addDoc(ideasCollection, {
        ...idea,
        createdAt: serverTimestamp()
      });
    });
  }

  getIdeas(): Observable<any[]> {
    return this.zone.run(() => {
      return runInInjectionContext(this.injector, () => {
        const ideasCollection = collection(this.firestore, 'ideas');
        const q = query(ideasCollection, orderBy('createdAt', 'desc'));
        return collectionData(q, { idField: 'id' });
      });
    });
  }

  deleteIdea(id: string) {
    return this.zone.run(() => {
      const ideaDoc = doc(this.firestore, 'ideas', id);
      return deleteDoc(ideaDoc);
    });
  }

  // Registrations
  addRegistration(data: any) {
    return this.zone.run(() => {
      const registrationsCollection = collection(this.firestore, 'registrations');
      return addDoc(registrationsCollection, data);
    });
  }

  getRegistrations(): Observable<any[]> {
    return this.zone.run(() => {
      const registrationsCollection = collection(this.firestore, 'registrations');
      return collectionData(registrationsCollection, { idField: 'id' });
    });
  }

  deleteRegistration(id: string) {
    return this.zone.run(() => {
      const registrationDoc = doc(this.firestore, 'registrations', id);
      return deleteDoc(registrationDoc);
    });
  }

  updateRegistrationStatus(id: string, status: string) {
    return this.zone.run(() => {
      const registrationDoc = doc(this.firestore, 'registrations', id);
      return updateDoc(registrationDoc, { estado: status });
    });
  }

  // File Upload (Generic)
  uploadFile(file: File, path: string): Promise<string> {
    return this.zone.run(() => {
        const storageRef = ref(this.storage, path);
        return uploadBytes(storageRef, file).then(() => getDownloadURL(storageRef));
    });
  }
}
