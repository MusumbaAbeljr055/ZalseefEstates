// Firebase configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAV_rYQGaIj5OyI6s5DGcpBxy7Q9K158kc",
  authDomain: "zalseef-estates.firebaseapp.com",
  projectId: "zalseef-estates",
  storageBucket: "zalseef-estates.firebasestorage.app",
  messagingSenderId: "641376558329",
  appId: "1:641376558329:web:61c4a8072d019d191d5628",
  measurementId: "G-PKMD5PMG2H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export Firebase services
export { 
    db, 
    auth, 
    storage, 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    ref,
    uploadBytes,
    getDownloadURL
};

// Property Management Functions
export const propertyService = {
    // Get all properties
    async getProperties(filters = {}) {
        try {
            let q = collection(db, 'properties');
            
            // Apply filters
            const conditions = [];
            if (filters.status && filters.status !== 'all') {
                conditions.push(where('status', '==', filters.status));
            }
            if (filters.type && filters.type !== '') {
                conditions.push(where('type', '==', filters.type));
            }
            if (filters.location && filters.location !== '') {
                conditions.push(where('location', '>=', filters.location));
                conditions.push(where('location', '<=', filters.location + '\uf8ff'));
            }
            
            if (conditions.length > 0) {
                q = query(q, ...conditions, orderBy('createdAt', 'desc'));
            } else {
                q = query(q, orderBy('createdAt', 'desc'));
            }
            
            const querySnapshot = await getDocs(q);
            const properties = [];
            querySnapshot.forEach((doc) => {
                properties.push({ id: doc.id, ...doc.data() });
            });
            return properties;
        } catch (error) {
            console.error('Error getting properties:', error);
            throw error;
        }
    },

    // Get featured properties - WORKING VERSION
async getFeaturedProperties() {
    try {
        console.log("🔄 Getting featured properties from Firestore...");
        
        // Get ALL properties first to debug
        const querySnapshot = await getDocs(collection(db, 'properties'));
        const allProperties = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            allProperties.push({ id: doc.id, ...data });
        });
        
        console.log("📊 ALL properties in database:", allProperties);
        
        // Filter for featured properties
        const featuredProperties = allProperties.filter(property => {
            const isFeatured = property.featured === true;
            const isAvailable = property.status === 'available';
            
            console.log(`🔍 Checking: "${property.title}"`, {
                featured: property.featured,
                status: property.status,
                isFeatured: isFeatured,
                isAvailable: isAvailable
            });
            
            return isFeatured && isAvailable;
        });
        
        console.log("⭐ FINAL featured properties:", featuredProperties);
        return featuredProperties;
        
    } catch (error) {
        console.error('❌ Error in getFeaturedProperties:', error);
        return [];
    }
},

    // Add new property
    async addProperty(propertyData) {
        try {
            const docRef = await addDoc(collection(db, 'properties'), {
                ...propertyData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding property:', error);
            throw error;
        }
    },

    // Update property
    async updateProperty(propertyId, updates) {
        try {
            const propertyRef = doc(db, 'properties', propertyId);
            await updateDoc(propertyRef, {
                ...updates,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error updating property:', error);
            throw error;
        }
    },

    // Delete property
    async deleteProperty(propertyId) {
        try {
            await deleteDoc(doc(db, 'properties', propertyId));
        } catch (error) {
            console.error('Error deleting property:', error);
            throw error;
        }
    }
};

// Inquiry Management Functions
export const inquiryService = {
    // Submit inquiry
    async submitInquiry(inquiryData) {
        try {
            const docRef = await addDoc(collection(db, 'inquiries'), {
                ...inquiryData,
                status: 'new',
                createdAt: new Date(),
                read: false
            });
            return docRef.id;
        } catch (error) {
            console.error('Error submitting inquiry:', error);
            throw error;
        }
    },

    // Get all inquiries
    async getInquiries() {
        try {
            const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const inquiries = [];
            querySnapshot.forEach((doc) => {
                inquiries.push({ id: doc.id, ...doc.data() });
            });
            return inquiries;
        } catch (error) {
            console.error('Error getting inquiries:', error);
            throw error;
        }
    },

    // Mark inquiry as read
    async markInquiryAsRead(inquiryId) {
        try {
            const inquiryRef = doc(db, 'inquiries', inquiryId);
            await updateDoc(inquiryRef, {
                read: true,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error marking inquiry as read:', error);
            throw error;
        }
    }
};

// Testimonial Management Functions
export const testimonialService = {
    // Submit testimonial
    async submitTestimonial(testimonialData) {
        try {
            const docRef = await addDoc(collection(db, 'testimonials'), {
                ...testimonialData,
                approved: false,
                createdAt: new Date()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error submitting testimonial:', error);
            throw error;
        }
    },

   // Get approved testimonials
async getTestimonials() {
    try {
        console.log("🔄 Fetching testimonials from Firestore...");
        
        // First, let's see ALL testimonials for debugging
        const allQuery = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
        const allSnapshot = await getDocs(allQuery);
        const allTestimonials = [];
        
        allSnapshot.forEach((doc) => {
            const data = doc.data();
            allTestimonials.push({ id: doc.id, ...data });
        });
        
        console.log("📊 ALL testimonials in database:", allTestimonials);
        
        // Now get only approved ones
        const q = query(
            collection(db, 'testimonials'),
            where('approved', '==', true),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const testimonials = [];
        
        querySnapshot.forEach((doc) => {
            testimonials.push({ id: doc.id, ...doc.data() });
        });
        
        console.log("✅ APPROVED testimonials:", testimonials);
        return testimonials;
        
    } catch (error) {
        console.error('❌ Error getting testimonials:', error);
        
        // Fallback: try without the approved filter
        console.log("🔄 Trying fallback: getting all testimonials...");
        try {
            const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const testimonials = [];
            querySnapshot.forEach((doc) => {
                testimonials.push({ id: doc.id, ...doc.data() });
            });
            console.log("📋 Fallback testimonials:", testimonials);
            return testimonials;
        } catch (fallbackError) {
            console.error('❌ Fallback also failed:', fallbackError);
            return [];
        }
    }
},
    // Get all testimonials for admin
    async getAllTestimonials() {
        try {
            const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const testimonials = [];
            querySnapshot.forEach((doc) => {
                testimonials.push({ id: doc.id, ...doc.data() });
            });
            return testimonials;
        } catch (error) {
            console.error('Error getting all testimonials:', error);
            throw error;
        }
    },

    // Approve testimonial
    async approveTestimonial(testimonialId) {
        try {
            const testimonialRef = doc(db, 'testimonials', testimonialId);
            await updateDoc(testimonialRef, {
                approved: true,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error approving testimonial:', error);
            throw error;
        }
    }
};

// Image Upload Function
export const uploadImage = async (file) => {
    try {
        const storageRef = ref(storage, `properties/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};