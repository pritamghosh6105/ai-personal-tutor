const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '../.env' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent('Say hi');
    await result.response;
    console.log('✅ API READY - Try generating your topic now!');
    process.exit(0);
  } catch(e) {
    if (e.status === 429) {
      const match = e.message.match(/retry in ([\d.]+)s/);
      const wait = match ? Math.ceil(parseFloat(match[1])) : 60;
      console.log(`⏳ WAIT ${wait} MORE SECONDS`);
      console.log('⚠️  Each attempt resets the timer - please wait!');
    } else {
      console.log('❌ Error:', e.message.substring(0, 100));
    }
    process.exit(1);
  }
}

test();
