export class OnboardingDB {
  private dbName = 'OnboardingDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('🔄 Opening IndexedDB...');
      
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('❌ Database failed to open');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ Database opened successfully');
        resolve();
      };

      // This runs when database is created for the first time or version changes
      request.onupgradeneeded = (event) => {
        console.log('🔧 Setting up database structure...');
        
        const db = (event.target as IDBOpenDBRequest).result;

        // Create a simple store for form drafts
        if (!db.objectStoreNames.contains('formDrafts')) {
          const store = db.createObjectStore('formDrafts', { keyPath: 'id' });
          console.log('📁 Created formDrafts store');
        }
      };
    });
  }

  // Simple save method
  async saveDraft(formData: any): Promise<boolean> {
    if (!this.db) {
      console.error('❌ Database not initialized');
      return false;
    }

    try {
      const transaction = this.db.transaction(['formDrafts'], 'readwrite');
      const store = transaction.objectStore('formDrafts');
      
      const draftData = {
        id: 'current-draft',
        data: formData,
        timestamp: new Date().toISOString()
      };

      await this.promisifyRequest(store.put(draftData));
      console.log('💾 Draft saved:', draftData);
      return true;
    } catch (error) {
      console.error('❌ Save failed:', error);
      return false;
    }
  }

  // Simple load method
  async loadDraft(): Promise<any | null> {
    if (!this.db) {
      console.error('❌ Database not initialized');
      return null;
    }

    try {
      const transaction = this.db.transaction(['formDrafts'], 'readonly');
      const store = transaction.objectStore('formDrafts');
      
      const result = await this.promisifyRequest(store.get('current-draft'));
      
      if (result) {
        console.log('📂 Draft loaded:', result);
        return result.data;
      } else {
        console.log('📂 No draft found');
        return null;
      }
    } catch (error) {
      console.error('❌ Load failed:', error);
      return null;
    }
  }

  // Helper to convert IndexedDB requests to promises
  private promisifyRequest<T = any>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}