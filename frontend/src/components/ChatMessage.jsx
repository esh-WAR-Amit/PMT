import { Avatar, Box, Flex, Text } from '@mantine/core';
import { useState } from 'react';

function ChatMessage({ message, user }) {
  const { text, uid, photoURL, user_name, createdAt } = message;
  const isCurrentUser = uid === user.id;

  const [showTime, setShowTime] = useState(false)

  const handleTimeToggle = ()=>{
    setShowTime((prev) => !prev);
  }

  function formatTimestamp(timestamp) {
    // Check if the timestamp is valid
    if (!timestamp || !timestamp.seconds) {
      return ''; // Return an empty string or placeholder if timestamp is invalid
    }
  
    const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
  
    // Extract the time components
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based in JavaScript
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
  
    // Format the time (12-hour format with AM/PM)
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    // Format the date (DD/MM/YY)
    const formattedDate = `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`;
  
    // Return formatted time and date
    return `${formattedHours}:${formattedMinutes} ${ampm}, ${formattedDate}`;
  }
  

  const timeSent = formatTimestamp(createdAt)

  return (
    <Flex
    direction={isCurrentUser ? 'row-reverse' : 'row'}
    align={'end'}
    mb={15}
    gap={5}
    maw={{base: "90vw", md:"90vw", lg:"80vw"}}
    >
      {/* Avatar positioned left or right depending on user */}
      <Avatar
        src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'}
        alt="User Avatar"
        size={30}
        radius="xl"
      />

      {/* Message Box */}
      <Flex direction={'column'} align={isCurrentUser? 'end' : 'start'} gap={2}>
      <Text fz={15} ff={'poppins'} fw={600} c="dark.6" >
          {user_name}
        </Text>
      <Flex
      onClick={()=>{
        setShowTime(!showTime);
      }}

      bg={isCurrentUser ? '#e8590c' : '#e9ecef'}
      c={isCurrentUser ? 'gray.2' : 'dark.6'}
      ml={isCurrentUser ? '10px' : '0'}
      mr={isCurrentUser ? '0' : '10px'}
      justify={'start'}
      maw={'60vw'}
      
        style={{
          borderRadius: '12px',
          padding: '8px 15px',
        }}
      >
       
        
        <Text  ff={'poppins'} fw={500} fz={14}  style={{
            wordWrap: 'break-word',
            whiteSpace: 'normal',
            overflowWrap: 'break-word', 
    wordBreak: 'break-word', 
        }} >{text}</Text>
      </Flex>

      {
        showTime && <Text  fz={11} fw={600} c="dark.3">
        {timeSent}
      </Text>
      }
      
      </Flex>
    </Flex>
  );
}

export default ChatMessage;


