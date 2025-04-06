const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  //Express her zaman: 1. istek (request), 2. yanıt (response) gönderir sırayı değiştiremezsin
  try {
    const { name, surname, email, password } = req.body; //kullanıcının yaptığı isteği karşılarken req.bosy ile okuyoruz
    //const { name, surname, ... } diyerek bu objeyi parçalıyoruz (destructuring)
    //body sayesinde:Formlardan gelen verileri alabiliriz

    //kullanıcı var mı kontrol et
    const userExist = await User.findOne({ email }); //findone fonksiyonu key ve value bekliyor aslında oraya yazdığımız şuydu {email:email}
    //soldaki email → MongoDB koleksiyonundaki alan (field) sağdaki email → bizim req.body'den aldığımız email değeri
    if (userExist) {
      return res
        .status(400)
        .json({ message: "Bu e-posta zaten kullanılıyor!" });
    }
    //JavaScript objesini JSON’a çevirip istemciye gönderir burada kullanıcıya gönderilecek mesajı json formatına çeviriyoruz
    //400 bir HTTP cevabının üst bilgisidir (header kısmı) .json({ ... }) → sadece içerik kısmını (body) JSON'a çevirir

    //şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //yeni kullanıcıyı oluştur
    const user = new User({
      name,
      surname,
      email,
      password: hashedPassword,
    });

    //veritabanına kayıt ediyoruz
    await user.save(); //Artık user bir User modelinin örneğidir

    //cevap dön
    res.status(201).json({ message: "Kayıt Başarılı", userId: user._id });
  } catch (error) {
    console.log("Kayıt Hatası:", error.message);
    res.status(500).json({ message: "Sunucu Hatası" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    //önce kullanıcı var mı bunu kontrol edelim
    if (!user) {
      return res.status(400).json({ message: "Kullanıcı Bulunamadı!" });
    }

    //şifre doğru mu kontrol edelim
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Şifre Hatalı!" });
    }

    res.status(200).json({ message: "Giriş Başarılı", userId: user._id }); //json a istediğimizi ekleyebiliriz
  } catch (error) {
    console.error("Giriş Hatası:", error.message);
    res.status(500).json({ message: "Sunucu Hatası" });
  }
};
