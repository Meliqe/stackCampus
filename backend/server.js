const express = require('express');
const dotenv= require('dotenv');

const authRoutes= require('./routes/authRoutes');
const connectDB = require('./config/db');

dotenv.config();

const app = express(); //express fonksiyonu web uygulama nesnesi dönüyor. biz de bu nesneyi app değişkenine atıyoruz
app.use(express.json()); //gelen http isteklerinde json formatındaki verileri alabilmemizi sağlar
//Yani req.body içinde o veriye ulaşabilmemizi mümkün kılar.Eğer express.json() middleware’ini kullanmazsan, req.body undefined olur
//yani bu fonksiyon “Express! Gelen isteklerde body varsa ve bu body JSON ise, onu çözümle (parse et) ve bir JavaScript objesine çevir. Sonra bunu req.body'ye ata.” diyor
//"Sunucuya gelen her istek (POST, GET, PUT, DELETE ne olursa olsun)eğer içinde JSON veri varsa, onu çözümle (parse et)ve sonra diğer kodlara geç."
// Yani Express önce bu işlemi yapar:
// ✅ JSON veriyi çözer
// ✅ req.body'ye koyar
// ✅ sonra senin yazdığın route'a geçer
connectDB(); //connectDB() önce mi yazılmalı? Çünkü sistem hazır olmadan route’lar çalışmamalı ama kesin değil
app.use('/api/auth',authRoutes);

//use() middleware fonksiyonudur app.use(...) yapısı, Express’te bir middleware tanımlamak anlamına gelir.
//app.use(...), Express'in bir özelliği.Anlamı:"Sunucuya gelen her istekte, bu fonksiyonu çalıştır."

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
});
//Uygulamanın belirli bir porttan dinlemeye başlamasını sağlar.