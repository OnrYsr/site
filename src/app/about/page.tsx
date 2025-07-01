'use client';

import { Users, Award, Target, Globe, CheckCircle, Star } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hakkımızda</h1>
          <p className="text-gray-600">
            3D tasarım dünyasında kalite ve yenilikçiliğin öncüsü
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            3D Tasarımın Geleceğini Şekillendiriyoruz
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
            2018'den beri profesyonel 3D modelleme ve tasarım alanında hizmet veriyoruz. 
            Müşterilerimizin hayallerini gerçeğe dönüştürüyoruz.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold text-yellow-300">1000+</div>
              <div className="text-blue-100">Mutlu Müşteri</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold text-yellow-300">5000+</div>
              <div className="text-blue-100">Tamamlanan Proje</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold text-yellow-300">4.9/5</div>
              <div className="text-blue-100">Müşteri Memnuniyeti</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Hikayemiz</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  2018 yılında, 3D tasarım alanında bir devrim yaratma hayaliyle yola çıktık. 
                  Teknoloji ve sanatın mükemmel uyumunu hedefleyerek, müşterilerimizin en yaratıcı 
                  fikirlerini hayata geçirmek için çalışıyoruz.
                </p>
                <p>
                  Bugün, Türkiye'nin önde gelen 3D tasarım şirketlerinden biri olarak, 
                  mimari görselleştirmeden oyun tasarımına, endüstriyel modellemeden 
                  animasyon karakterlerine kadar geniş bir yelpazede hizmet veriyoruz.
                </p>
                <p>
                  Deneyimli ekibimiz ve en son teknolojileri kullanarak, her projede 
                  mükemmellik arayışımızı sürdürüyoruz.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-white/50 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-lg transform rotate-45"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">3D Tasarım Uzmanlığı</h3>
                  <p className="text-gray-600">Profesyonel ekip, yaratıcı çözümler</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Misyonumuz</h3>
              <p className="text-gray-600">
                Müşterilerimizin yaratıcı vizyonlarını en yüksek kalitede 3D modellere 
                dönüştürerek, onların başarısına katkıda bulunmak. Her projede yenilikçi 
                çözümler sunarak sektörde öncü olmak.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Vizyonumuz</h3>
              <p className="text-gray-600">
                3D tasarım alanında global bir marka olmak ve teknolojik gelişmeleri 
                takip ederek müşterilerimize en güncel çözümleri sunmak. Sürdürülebilir 
                büyüme ile sektörde lider konuma ulaşmak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Değerlerimiz</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Çalışma prensiplerimizi oluşturan temel değerler
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Kalite</h3>
              <p className="text-gray-600">
                Her projede en yüksek kalite standartlarını koruyarak, müşteri 
                memnuniyetini ön planda tutuyoruz.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Müşteri Odaklılık</h3>
              <p className="text-gray-600">
                Müşterilerimizin ihtiyaçlarını anlayarak, onlara özel çözümler 
                geliştiriyor ve sürekli iletişim halinde kalıyoruz.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Yenilikçilik</h3>
              <p className="text-gray-600">
                Teknolojik gelişmeleri takip ederek, yaratıcı ve özgün tasarımlar 
                üretiyoruz.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Güvenilirlik</h3>
              <p className="text-gray-600">
                Söz verdiğimiz tarihlerde teslimat yaparak, şeffaf ve dürüst 
                iletişim kuruyoruz.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sürdürülebilirlik</h3>
              <p className="text-gray-600">
                Çevreye duyarlı yaklaşımlar benimseyerek, gelecek nesillere 
                yaşanabilir bir dünya bırakma sorumluluğumuzu yerine getiriyoruz.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Mükemmellik</h3>
              <p className="text-gray-600">
                Her detayda mükemmellik arayışımızı sürdürerek, sektörde 
                örnek alınan bir şirket olmayı hedefliyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ekibimiz</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Deneyimli ve yaratıcı ekibimizle projelerinizi hayata geçiriyoruz
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Ahmet Yılmaz', role: 'Kurucu & CEO', image: '/api/placeholder/200/200' },
              { name: 'Ayşe Demir', role: 'Tasarım Direktörü', image: '/api/placeholder/200/200' },
              { name: 'Mehmet Kaya', role: '3D Modelleme Uzmanı', image: '/api/placeholder/200/200' },
              { name: 'Fatma Özkan', role: 'Müşteri İlişkileri', image: '/api/placeholder/200/200' }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-lg transform rotate-45"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Projelerinizi Hayata Geçirelim
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Hayalinizdeki 3D tasarımı gerçeğe dönüştürmek için bizimle iletişime geçin
          </p>
          <button className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
            İletişime Geçin
          </button>
        </div>
      </section>
    </div>
  );
} 