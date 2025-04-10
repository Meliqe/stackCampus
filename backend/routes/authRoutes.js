const express = require("express");
const router = express.Router(); //router, senin özel rotalarını tutan mini bir sistemdir.

const { register, login } = require("../controllers/authController");

router.post("/register", register);
//⭐Birisi /register adresine bir POST isteği gönderirse, bu isteği register fonksiyonuna gönder.
//yani gelen istekle çalışacak fonksiyon callback
router.post("/login", login);

module.exports = router;
