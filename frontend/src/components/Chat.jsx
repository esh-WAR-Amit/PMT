import React, { useState, useRef, useEffect, useContext } from 'react';
import { getFirestore, collection, query, orderBy, limit, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { ProjectContext } from '../contexts/ProjectContext';
import { Avatar, Box, ScrollArea, Text, Button, Flex, LoadingOverlay } from '@mantine/core';
import { useAuth } from '../contexts/AuthContext';
import ChatMessage from './ChatMessage';
import { useNavigate } from 'react-router-dom';
import { getUserbyId } from '../apiService';
import { IconSend } from '@tabler/icons-react';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};


// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const Chat = () => {
  const { projectId } = useContext(ProjectContext);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState('');
  const [isSending, setIsSending] = useState(false);

  const dummy = useRef();

  useEffect(() => {
    if (!projectId) {
      console.error('Invalid projectId:', projectId);
      return;
    }
  }, [projectId]);

  // Fetch user data based on userId stored in localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchUserData(userId);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      const response = await getUserbyId(userId);
      setUser(response);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!projectId) return;

    // Fetch messages for the specific project from Firestore with onSnapshot
    const messagesRef = collection(firestore, `messages_${projectId}`);
    const q = query(messagesRef, orderBy('createdAt'), limit(25));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => doc.data());
      setMessages(fetchedMessages);
    });

    return () => unsubscribe(); // Clean up the listener
  }, [projectId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!formValue.trim() || isSending) return;

    if (!user || !user.id || !user.name) {
      console.error('User is not authenticated or missing required fields:', user);
      return;
    }

    const { id, profilepicurl, name } = user;

    setIsSending(true);
    try {
      const messagesRef = collection(firestore, `messages_${projectId}`);
      await addDoc(messagesRef, {
        text: formValue,
        createdAt: serverTimestamp(),
        uid: id,
        photoURL: profilepicurl,
        user_name: name,
      });

      setFormValue('');
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (!projectId || loading) {
    return (
      <LoadingOverlay
        visible={true}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: 'orange', type: 'bars' }}
      />
    );
  }

  return (
    <Flex mt={20} w="100%" direction="column" h="100%">
      <ScrollArea offsetScrollbars h="calc(100vh - 360px)" w="100%">
        {messages &&
          messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} user={user} />
          ))}
        <span ref={dummy}></span>
      </ScrollArea>
      <form
        onSubmit={sendMessage}
        style={{ display: 'flex'}}
      >
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Send a message..."
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '16px',
          }}
        />
        <Button
          type="submit"
          disabled={!formValue}
          c={'gray.2'}
          h={45}
          bg={formValue? 'orange.8': 'gray.2'}
          sx={{
            padding: '8px 12px',
            borderRadius: '5px',
            fontSize: '18px',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          <IconSend/>
        </Button>
      </form>
    </Flex>
  );
};

export default Chat;
