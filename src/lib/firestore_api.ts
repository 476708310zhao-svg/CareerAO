import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

export async function seedMockData() {
  try {
    // Basic jobs
    const jobsRef = collection(db, 'jobs');
    const jobsSnap = await getDocs(jobsRef);
    if (jobsSnap.empty) {
      console.log('Seeding jobs...');
      const mockJobs = [
        { 
          id: "job_1", 
          title: 'Software Engineer, New Grad 2026', 
          companyId: "comp_1",
          companyName: 'Google', 
          location: 'Mountain View, CA', 
          salary: '$130k - $180k', 
          type: '全职', 
          visa: true, 
          description: 'Join Google as a New Grad SWE.',
        },
        { 
          id: "job_2", 
          title: 'Data Analyst Intern', 
          companyId: "comp_2",
          companyName: 'Meta', 
          location: 'Menlo Park, CA', 
          salary: '$45 - $55 / hr', 
          type: '实习', 
          visa: true, 
          description: 'Data analytics internship at Meta.',
        }
      ];

      for (const job of mockJobs) {
        await setDoc(doc(db, 'jobs', job.id), {
          ...job,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    }

    // Basic companies
    const companiesRef = collection(db, 'companies');
    const companiesSnap = await getDocs(companiesRef);
    if (companiesSnap.empty) {
      console.log('Seeding companies...');
      const mockCompanies = [
        {
          id: "comp_1",
          name: "Google",
          logo: "https://logo.clearbit.com/google.com",
          website: "google.com",
          description: "Google LLC is an American multinational technology company."
        },
        {
          id: "comp_2",
          name: "Meta",
          logo: "https://logo.clearbit.com/meta.com",
          website: "meta.com",
          description: "Meta Platforms, Inc."
        }
      ];

      for (const comp of mockCompanies) {
        await setDoc(doc(db, 'companies', comp.id), {
          ...comp,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    }

    // Basic experiences
    const expRef = collection(db, 'interview_experiences');
    const expSnap = await getDocs(expRef);
    if (expSnap.empty) {
      console.log('Seeding experiences...');
      const mockExps = [
        {
          id: "exp_1",
          userId: "mock_user_1",
          company: "Google",
          role: "Software Engineer",
          round: "一面",
          content: "Asked about binary trees...",
          status: "published"
        }
      ];

      for (const exp of mockExps) {
        await setDoc(doc(db, 'interview_experiences', exp.id), {
          ...exp,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    }

  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'seed');
  }
}

export async function fetchJobsList() {
  try {
    const jobsRef = collection(db, 'jobs');
    const jobsSnap = await getDocs(jobsRef);
    return jobsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'jobs');
    return [];
  }
}

export async function fetchCompaniesList() {
  try {
    const companiesRef = collection(db, 'companies');
    const companiesSnap = await getDocs(companiesRef);
    return companiesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'companies');
    return [];
  }
}

export async function fetchExperiencesList() {
  try {
    const experiencesRef = collection(db, 'interview_experiences');
    const experiencesSnap = await getDocs(experiencesRef);
    return experiencesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'interview_experiences');
    return [];
  }
}
