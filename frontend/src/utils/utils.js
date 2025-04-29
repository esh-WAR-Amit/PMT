const utils = {
    timeConverter: (timestamp) => {
        const now = new Date();
        const date = new Date(timestamp);
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} seconds`;
        const minutes = Math.floor(diffInSeconds / 60);
        if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''}`;
        const days = Math.floor(hours / 24);
        return `${days} day${days !== 1 ? 's' : ''}`;
    },

    dateMantineToPostgre: (inputDate) => {
      const date = new Date(inputDate);
      const localISO = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
      return localISO;
  },

  datePostgreToMantine: (inputDate) => {
      const date = new Date(inputDate);
      return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toString();
  },

     generateRandomTaskDescription: () => {
        const words = [
            "Optimize", "improve", "code", "design", "implement", "develop", "framework", 
            "architecture", "debug", "enhance", "requirements", "algorithm", "performance", 
            "testing", "user", "interface", "integration", "deployment", "solution", "client", 
            "stakeholder", "feedback", "functionality", "iteration", "requirements", "analysis", 
            "deployment", "tasks", "quality", "efficiency", "time", "resource", "collaboration", 
            "sprint", "milestone", "deliverable", "documentation", "optimization", "scalability", 
            "user-experience", "problem-solving", "strategy", "plan", "testing", "iteration", 
            "debugging", "monitoring", "user-feedback", "reporting", "metrics", "goal", "iteration", 
            "bug-fixing", "release", "iteration", "tracking", "improvements", "quality-assurance"
          ];
        
          const randomSentence = () => {
            let sentence = '';
            const numWords = Math.floor(Math.random() * 8) + 5; // Sentence length between 5 and 12 words
            for (let i = 0; i < numWords; i++) {
              sentence += words[Math.floor(Math.random() * words.length)] + ' ';
            }
            sentence = sentence.trim();
            sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
            return sentence;
          };
        
          const generateParagraph = (numSentences) => {
            let paragraph = '';
            for (let i = 0; i < numSentences; i++) {
              paragraph += randomSentence() + ' ';
            }
            return paragraph.trim();
          };
        
          let taskDescription = '';
          let wordCount = 0;
          const minParagraphs = 5;  // Minimum number of paragraphs
          const maxParagraphs = 7;  // Maximum number of paragraphs
        
          // Keep generating paragraphs until we reach at least 500 words
          while (wordCount < 350) {
            // Randomly determine the number of sentences per paragraph (between 4 and 8 sentences)
            const numSentences = Math.floor(Math.random() * 5) + 4;  
            let paragraph = generateParagraph(numSentences);
            wordCount += paragraph.split(' ').length;
            taskDescription += paragraph + '\n\n';  // Add two line breaks for paragraph separation
          }
        
          return taskDescription.trim();
      }
      
};

export default utils;
