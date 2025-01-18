import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBwSZnlpZnHmgmpZhqLNWR5mqbetnUEcdI");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getResp(data){
    const prompt = ` ${data}. give me a json object according to the given data and the object should contain{

name:"",email:"",phone:"",skills:[{name:""}],description:"",qualifications:"",projects:[{projectName:""}],experience:[{company:"",role:""}]

}.`;
    console.log(prompt,"prompt")
    const result = await model.generateContent(prompt);
    const resp = result.response.text();
    const first = resp.indexOf('{');
    const last = resp.lastIndexOf('}');
    const json = resp.substring(first, last + 1);
    console.log(json);
    const obj = JSON.parse(json);
    return obj;
}