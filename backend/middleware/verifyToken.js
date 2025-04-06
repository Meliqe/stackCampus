const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => { //middleware ın standart yapısı (req, res, next) => { ... }
    //Middleware’ler Express’in içindeki “araya giren kontrol noktaları” gibidir. next 	"Her şey tamamsa, sıradaki işleme geç" demektir 

  const authHeader = req.headers.authorization;
  //Gelen isteğin (request’in) HTTP başlıkları (headers) kısmından Authorization adındaki değeri alır.authHeader içine atar.
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Yetkisiz! Token eksik." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; //req in user gibi bir özelliği yok ama biz ekleyebiliriz yani Request objesine yeni bir özellik ekliyoruz
    next();
  } catch (error) {
    return res.status(401).json({ message: "Geçersiz token!" });
  }
};
module.exports = verifyToken;

//Eğer hata varsa res.status(...) ile durdur, hata yoksa next() ile geç