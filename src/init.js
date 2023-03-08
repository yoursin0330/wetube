//모든걸 초기화시켜주는 파일
import "dotenv/config"
import "./db"; //파일 그 자체를 import
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = process.env.PORT || 4000;

const handleListening = () => console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`)
app.listen(PORT, handleListening)