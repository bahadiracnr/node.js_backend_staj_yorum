function Header() {
  return (
    <div>
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Staj Değerlendirme Platformu</h1>
            <div className="flex items-center gap-4">
              <a
                href="giris.html"
                className="text-white hover:text-indigo-100 transition-colors"
              >
                Giriş Yap
              </a>
              <a
                href="kayit.html"
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
              >
                Kayıt Ol
              </a>
            </div>
          </div>
          <p className="mt-2 text-indigo-100">
            Staj deneyimlerini paylaş, diğerlerinden ilham al
          </p>
        </div>
      </header>
    </div>
  );
}

export default Header;
