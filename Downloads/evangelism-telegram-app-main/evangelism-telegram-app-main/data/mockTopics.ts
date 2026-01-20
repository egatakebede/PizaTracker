import { Topic } from '../types';

export const mockTopics: Topic[] = [
  {
    id: 'topic-1',
    title: 'Introduction to Faith Sharing',
    summary: 'Learn the basics of sharing your faith with love and compassion',
    contentHtml: `
      <p>Sharing your faith is one of the most meaningful things you can do. It's not about convincing others, but about sharing the love and hope you've found.</p>
      
      <h3>Key Principles</h3>
      <ul>
        <li>Start with prayer and genuine care</li>
        <li>Listen more than you speak</li>
        <li>Share your personal story</li>
        <li>Be respectful of others' beliefs</li>
      </ul>
      
      <h3>Practical Tips</h3>
      <p>Begin conversations naturally. Ask questions about what people believe and why. Share how your faith has impacted your life personally.</p>
    `,
    verses: [
      {
        book: 'Matthew',
        chapter: 28,
        verse: '19-20',
        text: 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you.'
      },
      {
        book: '1 Peter',
        chapter: 3,
        verse: '15',
        text: 'But in your hearts revere Christ as Lord. Always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have. But do this with gentleness and respect.'
      }
    ],
    media: [
      {
        type: 'audio',
        url: 'https://example.com/audio/intro-faith.mp3',
        title: 'Prayer Before Sharing'
      },
      {
        type: 'video',
        url: 'https://example.com/video/intro.mp4',
        title: 'How to Start a Conversation'
      }
    ],
    quiz: [
      {
        q: 'What should you do before sharing your faith with someone?',
        options: ['Memorize all Bible verses', 'Pray for guidance and wisdom', 'Prepare a debate', 'Wait for them to ask'],
        answerIndex: 1,
        explanation: 'Prayer is essential. It helps you approach the conversation with the right heart and reliance on God\'s guidance.'
      },
      {
        q: 'What is the most important attitude when sharing faith?',
        options: ['Being convincing', 'Love and respect', 'Being knowledgeable', 'Being confident'],
        answerIndex: 1,
        explanation: 'Love and respect are foundational. People need to feel valued and heard, not argued with or pressured.'
      },
      {
        q: 'If someone disagrees with you, you should:',
        options: ['Argue your point', 'End the conversation', 'Listen and respect their view', 'Quote more Bible verses'],
        answerIndex: 2,
        explanation: 'Respecting others\' views shows genuine love and creates space for meaningful dialogue.'
      }
    ],
    difficulty: 'beginner',
    languages: ['en', 'am', 'om', 'ti'],
    category: 'Foundations',
    published: true,
    createdAt: '2024-11-15',
    createdBy: 'admin-1'
  },
  {
    id: 'topic-2',
    title: 'The Power of Personal Testimony',
    summary: 'How to share your personal story of faith effectively',
    contentHtml: `
      <p>Your personal story is one of the most powerful tools you have. It's authentic, relatable, and cannot be argued against.</p>
      
      <h3>Structure Your Story</h3>
      <ul>
        <li><strong>Before:</strong> What was life like before your faith journey?</li>
        <li><strong>How:</strong> How did you encounter God or make your decision?</li>
        <li><strong>After:</strong> How has your life changed since then?</li>
      </ul>
      
      <h3>Keep It Simple</h3>
      <p>Your story should be 2-3 minutes long. Focus on specific changes and feelings rather than theological concepts.</p>
    `,
    verses: [
      {
        book: 'Acts',
        chapter: 26,
        verse: '22-23',
        text: 'But God has helped me to this very day; so I stand here and testify to small and great alike.'
      }
    ],
    media: [
      {
        type: 'video',
        url: 'https://example.com/video/testimony.mp4',
        title: 'Example Testimony'
      }
    ],
    quiz: [
      {
        q: 'How long should your personal testimony be?',
        options: ['30 seconds', '2-3 minutes', '10 minutes', '30 minutes'],
        answerIndex: 1,
        explanation: 'A 2-3 minute testimony is long enough to be meaningful but short enough to hold attention and invite questions.'
      },
      {
        q: 'What makes a personal testimony powerful?',
        options: ['Using big theological words', 'Being authentic and relatable', 'Memorizing it perfectly', 'Making it dramatic'],
        answerIndex: 1,
        explanation: 'Authenticity connects with people. Share honestly about your real experiences and feelings.'
      }
    ],
    difficulty: 'beginner',
    languages: ['en', 'am'],
    category: 'Foundations',
    published: true,
    createdAt: '2024-11-20',
    createdBy: 'admin-1'
  },
  {
    id: 'topic-3',
    title: 'Handling Difficult Questions',
    summary: 'Responding to tough questions about faith with grace',
    contentHtml: `
      <p>You won't always have all the answers, and that's okay. Honesty and humility go a long way.</p>
      
      <h3>Common Difficult Questions</h3>
      <ul>
        <li>Why does God allow suffering?</li>
        <li>What about other religions?</li>
        <li>Is the Bible reliable?</li>
      </ul>
      
      <h3>How to Respond</h3>
      <p>It's okay to say "I don't know, but let me find out." Offer to research and follow up. Focus on what you do know - your experience and the core message of love and hope.</p>
    `,
    verses: [
      {
        book: 'Colossians',
        chapter: 4,
        verse: '6',
        text: 'Let your conversation be always full of grace, seasoned with salt, so that you may know how to answer everyone.'
      }
    ],
    media: [],
    quiz: [
      {
        q: 'What should you do if you don\'t know the answer to a question?',
        options: ['Make something up', 'Change the subject', 'Admit it and offer to find out', 'End the conversation'],
        answerIndex: 2,
        explanation: 'Honesty builds trust. Offering to research shows you care about giving a truthful answer.'
      }
    ],
    difficulty: 'intermediate',
    languages: ['en'],
    category: 'Practical Skills',
    published: true,
    createdAt: '2024-11-25',
    createdBy: 'admin-1'
  }
];
