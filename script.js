const app = {
    // --- CẤU HÌNH ---
    telegramToken: '8385014906:AAHW6FTDh1kntRBWWKGycGNulP9fVOe-o0w',
    chatId: '8282507504',
    adminAccount: { user: 'admin', pass: 'a4elite123' },
    isAdmin: false,

    // --- DỮ LIỆU GỐC (Dùng khi LocalStorage trống) ---
    products: [
        { id: 1, name: 'Nến Sả Chanh', price: 189000, image: 'sa.jpg', scent: 'Thư giãn, đuổi muỗi', desc: 'Hương sả thanh khiết giúp làm sạch không gian và đuổi muỗi hiệu quả.' },
        { id: 2, name: 'Nến Cam Ngọt', price: 199000, image: 'cam.jpg', scent: 'Tươi mát, năng lượng', desc: 'Mang lại sự sảng khoái, giúp giảm căng thẳng sau giờ làm việc.' },
        { id: 3, name: 'Nến Vỏ Bưởi', price: 209000, image: 'buoi.jpg', scent: 'Thanh nhẹ, giảm stress', desc: 'Mùi hương vỏ bưởi truyền thống, giúp tinh thần thư thái.' },
        { id: 4, name: 'Nến Hoa Hồng', price: 249000, image: 'hoahong.jpg', scent: 'Quyến rũ, lãng mạn', desc: 'Mùi hương của sự lãng mạn, thích hợp cho các buổi tối ấm cúng.' },
        { id: 5, name: 'Nến Oải Hương', price: 259000, image: 'oaihuong.jpg', scent: 'Lavender giúp ngủ ngon', desc: 'Hương Lavender chuẩn Pháp, mang lại giấc ngủ sâu và bình yên.' },
        { id: 6, name: 'Nến Tinh Dầu Tràm', price: 179000, image: 'tram.jpg', scent: 'Hương tràm ấm áp', desc: 'Lọc sạch không khí, giữ ấm không gian phòng ngủ.' }
    ],

    cart: [],
    currentPage: 'home',

    init() {
        // Ưu tiên tải dữ liệu đã chỉnh sửa từ LocalStorage
        const savedProducts = localStorage.getItem('a4Products');
        if (savedProducts) this.products = JSON.parse(savedProducts);

        this.initAuthListener();
        const savedCart = localStorage.getItem('a4Cart');
        if (savedCart) this.cart = JSON.parse(savedCart);
        
        this.updateCartBadge();
        this.showPage('home');
    },

    initAuthListener() {
    window.fb.onAuthStateChanged(window.fb.auth, async (user) => {
        const loginBtn = document.getElementById('loginBtn');
        const userEl = document.getElementById('userInfo');

        if (user) {
            // 1. Lấy thông tin từ Firestore
            const docRef = window.fb.doc(window.fb.db, "customers", user.uid);
            const docSnap = await window.fb.getDoc(docRef);
            const name = docSnap.exists() ? docSnap.data().fullName : user.email;

            // 2. Cập nhật giao diện Header
            if(userEl) {
                userEl.innerHTML = `<span>Chào, <b>${name}</b></span>`;
                userEl.classList.remove('hidden');
            }
            if(loginBtn) {
                loginBtn.innerHTML = '<i data-lucide="log-out" class="w-5 h-5"></i><span>Đăng xuất</span>';
                loginBtn.onclick = () => window.fb.signOut(window.fb.auth).then(() => location.reload());
                lucide.createIcons();
            }

            // 3. Tự động về trang chủ nếu đang ở trang login
            if (this.currentPage === 'login') {
                this.showPage('home');
            }
        } else {
            // Khi đăng xuất hoặc chưa đăng nhập
            if(userEl) userEl.classList.add('hidden');
            if(loginBtn) {
                loginBtn.innerHTML = '<i data-lucide="user" class="w-5 h-5"></i><span>Đăng nhập</span>';
                loginBtn.onclick = () => this.showPage('login');
                lucide.createIcons();
            }
        }
    });
},
showPage(page) {
    this.currentPage = page;
    const main = document.getElementById('app');
    
    // Hiệu ứng mượt mà
    main.style.opacity = '0';
    main.style.transform = 'translateY(20px)';

    setTimeout(() => {
        if (page === 'home') this.renderHome(main);
        else if (page === 'products') this.renderProducts(main);
        else if (page === 'contact') this.renderContact(main);
        else if (page === 'login') this.renderLogin(main);
        else if (page === 'cart') this.renderCart(main);
        else if (page === 'history') this.renderHistory(main);
        // PHẢI CÓ 2 DÒNG DƯỚI ĐÂY:
        else if (page === 'admin-login') this.renderAdminLogin(main);
        else if (page === 'admin-dashboard') this.renderAdminDashboard(main);
        
        main.style.opacity = '1';
        main.style.transform = 'translateY(0)';
        if(window.lucide) lucide.createIcons();
    }, 100);
},

    // --- GIAO DIỆN NGƯỜI DÙNG ---
    renderHome(container) {
        container.innerHTML = `
            <section class="py-20 px-4 text-center">
                <h1 class="text-5xl md:text-7xl font-serif italic text-amber-900 mb-6 drop-shadow-md">Thắp Sáng Cảm Xúc</h1>
                <p class="text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-medium">🍃 Nến xanh thuần khiết, chuẩn vị tự nhiên từ A4 Elite Candle. 🌿</p>
                <button onclick="app.showPage('products')" class="bg-amber-800 text-white px-10 py-4 rounded-full font-bold shadow-xl hover:scale-105 transition">Khám Phá Sản Phẩm</button>
            </section>
            <div class="max-w-7xl mx-auto px-4 pb-16">
                <h2 class="text-3xl font-serif italic text-center text-amber-900 mb-12">Sản Phẩm Nổi Bật</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${this.products.slice(0, 4).map(p => this.card(p)).join('')}
                </div>
            </div>`;
    },

    renderProducts(container) {
        container.innerHTML = `<div class="max-w-7xl mx-auto px-4 py-12 text-center"><h2 class="text-4xl font-serif italic text-amber-900 mb-12">Tất Cả Sản Phẩm</h2><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">${this.products.map(p => this.card(p)).join('')}</div></div>`;
    },

    card(p) {
    return `<div class="bg-white rounded-3xl overflow-hidden shadow-sm border border-amber-50 flex flex-col h-full hover:shadow-lg transition transform hover:-translate-y-2">
        <img src="${p.image}" class="h-56 w-full object-cover bg-gray-100">
        <div class="p-6 flex flex-col flex-grow text-left">
            <h3 class="text-xl font-bold font-serif mb-1 text-amber-900">${p.name}</h3>
            <p class="text-xs font-bold text-orange-600 mb-2 uppercase tracking-wide">${p.scent}</p>
            <p class="text-sm text-gray-500 mb-4 line-clamp-3 italic">${p.desc || ''}</p>
            <div class="mt-auto flex flex-col gap-3">
                <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-amber-800">${p.price.toLocaleString()}đ</span>
                    <button onclick="app.addToCart(${p.id})" class="bg-amber-100 p-3 rounded-2xl border border-amber-200 hover:bg-amber-200 transition" title="Thêm vào giỏ">
                        <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                    </button>
                </div>
                <button onclick="app.buyNow(${p.id})" class="w-full bg-amber-800 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-amber-900 transition shadow-md">
                    Mua Ngay
                </button>
            </div>
        </div>
    </div>`;
},
openModal() {
    const modal = document.getElementById('checkoutModal');
    modal.style.display = 'flex';
    this.renderOrderSummary();
    this.prefill();
    // Quan trọng để hiện icon X và icon Send mới
    if(window.lucide) lucide.createIcons(); 
},

closeModal() {
    const modal = document.getElementById('checkoutModal');
    // Thêm một chút hiệu ứng ẩn trước khi tắt hẳn
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        modal.style.opacity = '1';
    }, 200);
},
    renderCart(container) {
        const total = this.cart.reduce((s, i) => s + (i.price * i.qty), 0);
        if (this.cart.length === 0) return container.innerHTML = `<div class="py-40 text-center"><i data-lucide="shopping-bag" class="mx-auto w-16 h-16 text-gray-200 mb-4"></i><h2 class="text-2xl text-gray-400 font-bold font-serif">Giỏ hàng đang trống</h2><button onclick="app.showPage('products')" class="mt-4 bg-amber-800 text-white px-8 py-3 rounded-xl font-bold">Đi Mua Sắm</button></div>`;
        
        container.innerHTML = `
            <div class="max-w-3xl mx-auto px-4 py-12">
                <h2 class="text-3xl font-serif italic mb-8 text-amber-900">Giỏ Hàng Của Bạn</h2>
                <div class="bg-white rounded-3xl p-6 shadow-xl border border-amber-50">
                    ${this.cart.map(i => `
                        <div class="flex items-center gap-4 py-4 border-b last:border-0">
                            <img src="${i.image}" class="w-20 h-20 rounded-xl object-cover border bg-gray-50">
                            <div class="flex-1">
                                <h4 class="font-bold text-gray-800">${i.name}</h4>
                                <p class="text-amber-700 font-bold text-sm">${i.price.toLocaleString()}đ</p>
                            </div>
                            <div class="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-xl border">
                                <button onclick="app.updateQty(${i.id}, -1)" class="font-bold">-</button>
                                <span class="font-bold w-4 text-center">${i.qty}</span>
                                <button onclick="app.updateQty(${i.id}, 1)" class="font-bold">+</button>
                            </div>
                            <button onclick="app.remove(${i.id})" class="text-gray-300 hover:text-red-500 ml-2"><i data-lucide="trash-2"></i></button>
                        </div>`).join('')}
                    <div class="mt-8 flex flex-col sm:flex-row justify-between items-center pt-6 border-t gap-4">
                        <div><p class="text-gray-400 text-xs font-bold uppercase">Tổng thanh toán:</p><p class="text-3xl font-bold text-amber-950">${total.toLocaleString()}đ</p></div>
                        <button onclick="app.openModal()" class="w-full sm:w-auto bg-gray-900 text-white px-12 py-4 rounded-2xl font-bold shadow-lg hover:bg-black transition">Thanh Toán Ngay</button>
                    </div>
                </div>
            </div>`;
    },

    renderContact(container) {
        container.innerHTML = `<div class="max-w-2xl mx-auto py-20 px-4 text-center"><div class="bg-white p-12 rounded-[3rem] shadow-xl border border-amber-100"><h2 class="text-3xl font-serif italic text-amber-900 mb-6">Liên Hệ Chúng Tôi</h2><p class="text-gray-600 mb-8">Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại nhắn tin cho nhóm nhé!</p><a href="https://www.facebook.com/profile.php?id=61586685254795" target="_blank" class="inline-flex items-center gap-3 bg-[#1877F2] text-white px-10 py-4 rounded-xl font-bold hover:scale-105 transition shadow-lg"><i data-lucide="facebook"></i><span>Facebook Fanpage</span></a></div></div>`;
    },

    renderLogin(container) {
        container.innerHTML = `
            <div class="max-w-4xl mx-auto py-16 grid md:grid-cols-2 gap-10 px-4">
                <div class="bg-white p-8 rounded-3xl shadow-xl border border-amber-100">
                    <h2 class="text-2xl font-bold mb-6 text-amber-900 font-serif italic">Đăng Nhập</h2>
                    <input type="email" id="logEmail" placeholder="Email" class="w-full p-4 border rounded-xl mb-4 outline-none focus:ring-2 focus:ring-amber-500 shadow-sm">
                    <input type="password" id="logPass" placeholder="Mật khẩu" class="w-full p-4 border rounded-xl mb-6 outline-none focus:ring-2 focus:ring-amber-500 shadow-sm">
                    <button onclick="app.handleLogin()" class="w-full bg-amber-800 text-white py-4 rounded-xl font-bold shadow-md">Vào Cửa Hàng</button>
                </div>
                <div class="bg-white p-8 rounded-3xl shadow-xl border border-orange-100">
                    <h2 class="text-2xl font-bold mb-6 text-amber-900 font-serif italic">Đăng Ký Thành Viên</h2>
                    <input type="text" id="regName" placeholder="Họ và tên" class="w-full p-4 border rounded-xl mb-4 outline-none">
                    <input type="email" id="regEmail" placeholder="Email" class="w-full p-4 border rounded-xl mb-4 outline-none">
                    <input type="password" id="regPass" placeholder="Mật khẩu" class="w-full p-4 border rounded-xl mb-6 outline-none">
                    <button onclick="app.handleRegister()" class="w-full bg-orange-600 text-white py-4 rounded-xl font-bold shadow-md">Tạo Tài Khoản Cloud</button>
                </div>
            </div>`;
    },
async renderHistory(container) {
    const user = window.fb.auth.currentUser;
    if (!user) {
        alert("Vui lòng đăng nhập để xem lịch sử!");
        return this.showPage('login');
    }

    container.innerHTML = `<div class="py-20 text-center"><p>⏳ Đang tải lịch sử đơn hàng...</p></div>`;

    try {
        // Truy vấn đơn hàng của người dùng hiện tại
        const q = window.fb.query(
            window.fb.collection(window.fb.db, "orders"),
            window.fb.where("userId", "==", user.uid)
        );
        const querySnapshot = await window.fb.getDocs(q);

        let html = `
            <div class="max-w-4xl mx-auto px-4 py-12">
                <h2 class="text-3xl font-serif italic mb-8 text-amber-900">Đơn Hàng Của Bạn</h2>
                <div class="space-y-4">`;

        if (querySnapshot.empty) {
            html += `<p class="text-gray-500 text-center py-10">Bạn chưa có đơn hàng nào.</p>`;
        } else {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                html += `
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-amber-50 flex justify-between items-center">
                        <div>
                            <p class="font-bold text-amber-900">Mã đơn: #${doc.id.slice(0, 8)}</p>
                            <p class="text-xs text-gray-500">${new Date(data.createdAt).toLocaleString('vi-VN')}</p>
                            <p class="font-bold mt-2">${data.totalPrice.toLocaleString()}đ</p>
                        </div>
                        <div class="text-right">
                            <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase ${data.status === 'Hoàn thành' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}">
                                ${data.status || 'Đang xử lý'}
                            </span>
                        </div>
                    </div>`;
            });
        }

        html += `</div></div>`;
        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = `<div class="py-20 text-center text-red-500">Lỗi khi tải dữ liệu!</div>`;
    }
},
    // --- ADMIN DASHBOARD ---
    renderAdminLogin(container) {
        container.innerHTML = `<div class="max-w-md mx-auto py-24 px-4"><div class="bg-white p-10 rounded-3xl shadow-2xl border border-amber-100"><h2 class="text-2xl font-serif mb-6 text-center italic text-amber-900 font-bold">Admin Đăng Nhập</h2><input type="text" id="admU" placeholder="User" class="w-full p-4 border rounded-xl mb-4 outline-none"><input type="password" id="admP" placeholder="Password" class="w-full p-4 border rounded-xl mb-6 outline-none"><button onclick="app.loginAdmin()" class="w-full bg-amber-900 text-white py-4 rounded-xl font-bold shadow-lg">Xác Nhận</button></div></div>`;
    },

loginAdmin() {
    const u = document.getElementById('admU').value;
    const p = document.getElementById('admP').value;
    
    if(u === this.adminAccount.user && p === this.adminAccount.pass) { 
        this.isAdmin = true; 
        alert("Chào mừng Admin A4 Elite!");
        this.showPage('admin-dashboard'); // Chuyển thẳng vào trang quản lý
    } else {
        alert("Sai tài khoản hoặc mật khẩu quản trị!");
    }
},

    renderAdminDashboard(container) {
        if(!this.isAdmin) return this.showPage('admin-login');
        container.innerHTML = `
            <div class="max-w-6xl mx-auto px-4 py-12">
                <div class="flex justify-between items-center mb-8">
                    <h2 class="text-3xl font-serif italic text-amber-900 font-bold">Quản Lý A4 Elite Candle</h2>
                    <button onclick="app.isAdmin=false; app.showPage('home')" class="bg-red-50 text-red-600 px-6 py-2 rounded-xl font-bold hover:bg-red-100 transition">Đăng xuất</button>
                </div>

                <div class="bg-white p-8 rounded-3xl shadow-sm border border-amber-100 mb-10">
                    <h3 class="font-bold mb-6 text-amber-800 text-lg flex items-center gap-2"><i data-lucide="plus-circle"></i> Thêm sản phẩm mới</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <input type="text" id="newN" placeholder="Tên nến" class="border p-3 rounded-xl outline-none"><input type="number" id="newG" placeholder="Giá" class="border p-3 rounded-xl outline-none"><input type="text" id="newH" placeholder="Link ảnh (vd: sa.jpg)" class="border p-3 rounded-xl outline-none"><input type="text" id="newM" placeholder="Mùi hương" class="border p-3 rounded-xl outline-none"><button onclick="app.addProduct()" class="bg-amber-800 text-white rounded-xl font-bold p-3 hover:bg-black transition">Lưu Mới</button>
                    </div>
                </div>

                <div class="space-y-6">
                    ${this.products.map((p, index) => `
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-6 gap-4 items-end">
                            <div class="lg:col-span-1"><label class="text-[10px] font-bold text-gray-400 uppercase">Tên nến</label><input type="text" value="${p.name}" onchange="app.updateP(${index}, 'name', this.value)" class="w-full border-b py-2 outline-none font-bold text-amber-900 bg-transparent"></div>
                            <div><label class="text-[10px] font-bold text-gray-400 uppercase">Giá (đ)</label><input type="number" value="${p.price}" onchange="app.updateP(${index}, 'price', this.value)" class="w-full border-b py-2 outline-none bg-transparent"></div>
                            <div><label class="text-[10px] font-bold text-gray-400 uppercase">Link ảnh</label><input type="text" value="${p.image}" onchange="app.updateP(${index}, 'image', this.value)" class="w-full border-b py-2 outline-none bg-transparent text-blue-500"></div>
                            <div><label class="text-[10px] font-bold text-gray-400 uppercase">Mùi hương</label><input type="text" value="${p.scent}" onchange="app.updateP(${index}, 'scent', this.value)" class="w-full border-b py-2 outline-none bg-transparent"></div>
                            <div class="lg:col-span-1"><label class="text-[10px] font-bold text-gray-400 uppercase">Mô tả chi tiết</label><textarea onchange="app.updateP(${index}, 'desc', this.value)" class="w-full border-b py-1 outline-none text-xs h-8 bg-transparent">${p.desc || ''}</textarea></div>
                            <div class="flex justify-center"><button onclick="app.delP(${p.id})" class="text-red-300 hover:text-red-500 transition"><i data-lucide="trash-2"></i></button></div>
                        </div>`).join('')}
                </div>
            </div>`;
        if (window.lucide) lucide.createIcons();
    },

    // --- LOGIC HÀNH ĐỘNG ---
    async handleRegister() {
        const email = document.getElementById('regEmail').value, pass = document.getElementById('regPass').value, name = document.getElementById('regName').value;
        try {
            const res = await window.fb.createUserWithEmailAndPassword(window.fb.auth, email, pass);
            await window.fb.setDoc(window.fb.doc(window.fb.db, "customers", res.user.uid), { fullName: name, email, createdAt: new Date() });
            alert("Đăng ký thành công!"); this.showPage('home');
        } catch (e) { alert("Lỗi: " + e.message); }
    },
async handleLogin() {
    const email = document.getElementById('logEmail').value;
    const pass = document.getElementById('logPass').value;
    
    // Sửa lỗi: Tìm nút một cách an toàn hơn
    const loginBtn = document.querySelector('button[onclick*="handleLogin"]'); 
    
    try {
        // Chỉ đổi chữ nếu tìm thấy nút
        if (loginBtn) loginBtn.innerText = "⏳ Đang xác thực..."; 
        
        await window.fb.signInWithEmailAndPassword(window.fb.auth, email, pass);
        // Sau khi đăng nhập xong, listener onAuthStateChanged sẽ tự chuyển trang
    } catch (e) {
        if (loginBtn) loginBtn.innerText = "Vào Cửa Hàng";
        alert("Thông tin đăng nhập không chính xác!");
    }
},

    addToCart(id) {
        const p = this.products.find(x => x.id === id);
        const ex = this.cart.find(x => x.id === id);
        if(ex) ex.qty++; else this.cart.push({...p, qty: 1});
        this.saveCart(); this.updateCartBadge();
        
    },
    buyNow(id) {
    this.addToCart(id);
    this.showPage('cart');
    // Tùy chọn: Tự động mở luôn modal thanh toán
    setTimeout(() => this.openModal(), 300);
},
    updateQty(id, delta) {
        const item = this.cart.find(x => x.id === id);
        if(item) { item.qty += delta; if(item.qty <= 0) this.remove(id); }
        this.saveCart(); this.updateCartBadge(); this.renderCart(document.getElementById('app')); if(window.lucide) lucide.createIcons();
    },
    remove(id) { this.cart = this.cart.filter(x => x.id !== id); this.saveCart(); this.updateCartBadge(); this.renderCart(document.getElementById('app')); if(window.lucide) lucide.createIcons(); },
    saveCart() { localStorage.setItem('a4Cart', JSON.stringify(this.cart)); },
    updateCartBadge() {
        const b = document.getElementById('cartCount'), c = this.cart.reduce((s,i)=>s+i.qty,0);
        if(b) { b.innerText = c; c > 0 ? b.classList.remove('hidden') : b.classList.add('hidden'); }
    },

    // --- ADMIN ACTIONS ---
    
    updateP(index, field, value) {
        if(field === 'price') value = parseInt(value);
        this.products[index][field] = value;
        localStorage.setItem('a4Products', JSON.stringify(this.products));
        console.log("Updated", field);
    },
async addProduct() {
    const n = document.getElementById('newN').value;
    const g = parseInt(document.getElementById('newG').value);
    const m = document.getElementById('newM').value;
    const fileInput = document.getElementById('newImgFile');
    const btn = document.getElementById('btnAddProduct');

    // LẤY API KEY TẠI: https://api.imgbb.com/
    const apiKey = '90946a06d26d655277fea8014e5cb2b3'; 

    if(!n || !g || !fileInput.files[0]) return alert("Vui lòng nhập Tên, Giá và Chọn Ảnh!");

    try {
        btn.innerText = "⏳ Đang tải ảnh..."; btn.disabled = true;

        // 1. Gửi ảnh lên ImgBB
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: 'POST', body: formData });
        const data = await res.json();
        const imageUrl = data.data.url;

        // 2. Lưu vào danh sách
        this.products.push({ id: Date.now(), name: n, price: g, image: imageUrl, scent: m || 'Thảo mộc' });
        localStorage.setItem('a4Products', JSON.stringify(this.products));
        
        alert("Đã thêm nến mới thành công!");
        this.renderAdminDashboard(document.getElementById('app'));
    } catch (e) { alert("Lỗi tải ảnh lên ImgBB!"); }
    finally { btn.innerText = "Lưu Mới"; btn.disabled = false; }
},
    delP(id) { if(confirm("Xóa sản phẩm này?")) { this.products = this.products.filter(p=>p.id!==id); localStorage.setItem('a4Products', JSON.stringify(this.products)); this.renderAdminDashboard(document.getElementById('app')); } },

    // --- THANH TOÁN ---
    openModal() { document.getElementById('checkoutModal').style.display = 'flex'; this.renderOrderSummary(); this.prefill(); },
    closeModal() { document.getElementById('checkoutModal').style.display = 'none'; },
    closeSuccessModal() { document.getElementById('successModal').style.display = 'none'; this.cart = []; this.saveCart(); this.updateCartBadge(); this.showPage('home'); },
    renderOrderSummary() {
        const total = this.cart.reduce((s,i)=>s+(i.price*i.qty),0);
        document.getElementById('orderSummary').innerHTML = `<div class="font-bold border-b pb-2 mb-2 text-amber-900">Chi tiết đơn hàng:</div>${this.cart.map(i=>`<div class="text-sm flex justify-between"><span>${i.name} x${i.qty}</span><span>${(i.price*i.qty).toLocaleString()}đ</span></div>`).join('')}<div class="text-right font-bold pt-2 text-red-600 mt-2">Tổng: ${total.toLocaleString()}đ</div>`;
    },
    async prefill() {
        const user = window.fb.auth.currentUser;
        if(user) {
            const docSnap = await window.fb.getDoc(window.fb.doc(window.fb.db, "customers", user.uid));
            if(docSnap.exists()) {
                const data = docSnap.data();
                if(document.getElementById('custName')) document.getElementById('custName').value = data.fullName || '';
                if(document.getElementById('custPhone')) document.getElementById('custPhone').value = data.phone || '';
                if(document.getElementById('custAddress')) document.getElementById('custAddress').value = data.address || '';
            }
        }
    },
async submitOrder(e) {
    e.preventDefault();
    const user = window.fb.auth.currentUser;
    if (!user) return alert("Vui lòng đăng nhập để đặt hàng!");

    const btn = document.getElementById('btnSubmit'), original = btn.innerHTML;
    btn.innerHTML = '⏳ Đang xử lý...'; btn.disabled = true;

    const info = { 
        n: document.getElementById('custName').value, 
        p: document.getElementById('custPhone').value, 
        a: document.getElementById('custAddress').value 
    };
    const total = this.cart.reduce((s, i) => s + (i.price * i.qty), 0);
    const createdAt = new Date().toISOString();

    try {
        // --- BƯỚC 1: TỰ ĐỘNG LƯU VÀO FIRESTORE ---
        const orderData = {
            userId: user.uid,
            customerName: info.n,
            phone: info.p,
            address: info.a,
            items: this.cart,
            totalPrice: total,
            status: "Đang xử lý", // Trạng thái mặc định
            createdAt: createdAt
        };
        
        // Tạo một document mới trong collection 'orders'
        const orderRef = window.fb.doc(window.fb.collection(window.fb.db, "orders"));
        await window.fb.setDoc(orderRef, orderData);

        // --- BƯỚC 2: GỬI THÔNG BÁO TELEGRAM ---
        const msg = `🔥 <b>ĐƠN HÀNG MỚI (A4 ELITE)</b> 🔥\n👤 Khách: ${info.n}\n💰 Tổng: <b>${total.toLocaleString()}đ</b>\n👉 Kiểm tra lịch sử trên web!`;
        await fetch(`https://api.telegram.org/bot${this.telegramToken}/sendMessage`, { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({chat_id: this.chatId, text: msg, parse_mode: 'HTML'}) 
        });

        this.closeModal(); 
        document.getElementById('successModal').style.display = 'flex';
    } catch (e) { 
        console.error(e);
        alert("Lỗi gửi đơn! Bạn hãy kiểm tra lại kết nối mạng."); 
    } finally { 
        btn.innerHTML = original; btn.disabled = false; 
    }
},
    async renderHistory(container) {
    const user = window.fb.auth.currentUser;
    if(!user) return this.showPage('login');

    container.innerHTML = `<div class="p-8 text-center">⏳ Đang tải lịch sử đơn hàng...</div>`;

    // Lấy đơn hàng của người dùng hiện tại từ Database
    const q = window.fb.query(
        window.fb.collection(window.fb.db, "orders"), 
        window.fb.where("userId", "==", user.uid)
    );
    const querySnapshot = await window.fb.getDocs(q);

    let html = `<div class="max-w-4xl mx-auto p-4"><h2 class="text-2xl font-bold mb-6">Đơn hàng của bạn</h2>`;
    
    if (querySnapshot.empty) {
        html += `<p class="text-gray-500">Bạn chưa có đơn hàng nào.</p>`;
    } else {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            html += `
                <div class="bg-white p-6 rounded-2xl shadow-sm border mb-4 flex justify-between items-center">
                    <div>
                        <p class="font-bold">Mã đơn: #${doc.id.slice(0, 6)}</p>
                        <p class="text-sm text-gray-500">${new Date(data.createdAt).toLocaleDateString('vi-VN')}</p>
                        <p class="text-amber-800 font-bold">${data.totalPrice.toLocaleString()}đ</p>
                    </div>
                    <div class="text-right">
                        <span class="px-4 py-1 rounded-full text-xs font-bold ${data.status === 'Đang xử lý' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}">
                            ${data.status}
                        </span>
                    </div>
                </div>`;
        });
    }
    html += `</div>`;
    container.innerHTML = html;
},
renderAdminDashboard(container) {
    if(!this.isAdmin) return this.showPage('admin-login');
    container.innerHTML = `
        <div class="max-w-6xl mx-auto px-4 py-12 animate__animated animate__fadeIn">
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-3xl font-serif italic text-amber-900 font-bold">Quản Trị A4 Elite</h2>
                <button onclick="app.isAdmin=false; app.showPage('home')" class="bg-red-50 text-red-600 px-6 py-2 rounded-xl font-bold hover:bg-red-100 transition">Đăng xuất</button>
            </div>

            <div class="flex gap-4 mb-8 border-b pb-4">
                <button onclick="app.renderAdminDashboard(document.getElementById('app'))" class="font-bold text-amber-900 border-b-2 border-amber-900 pb-2">📦 Sản phẩm</button>
                <button onclick="app.renderAdminOrders(document.getElementById('app'))" class="font-bold text-gray-400 hover:text-amber-700 pb-2">📋 Đơn hàng & Tiến độ</button>
            </div>

            <div class="bg-white p-8 rounded-3xl shadow-sm border border-amber-100 mb-10">
                <h3 class="font-bold mb-6 text-amber-800 text-lg flex items-center gap-2"><i data-lucide="plus-circle"></i> Thêm nến mới</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <input type="text" id="newN" placeholder="Tên nến" class="border p-3 rounded-xl outline-none text-sm">
                    <input type="number" id="newG" placeholder="Giá (đ)" class="border p-3 rounded-xl outline-none text-sm">
                    <input type="text" id="newM" placeholder="Mùi hương" class="border p-3 rounded-xl outline-none text-sm">
                    <input type="file" id="newImgFile" class="text-[10px] border p-2 rounded-xl bg-gray-50">
                    <button id="btnAddProduct" onclick="app.addProduct()" class="bg-amber-800 text-white rounded-xl font-bold p-3 hover:bg-black transition">Lưu Mới</button>
                </div>
            </div>

            <div class="space-y-4">
                <h3 class="font-bold text-amber-900 mb-4">Danh sách & Chỉnh sửa</h3>
                ${this.products.map((p, index) => `
                    <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-6 gap-3 items-end">
                        <div class="lg:col-span-1">
                            <label class="text-[9px] font-bold text-gray-400 uppercase">Tên nến</label>
                            <input type="text" id="editN-${index}" value="${p.name}" class="w-full border-b py-1 outline-none font-bold text-amber-900 text-sm bg-transparent">
                        </div>
                        <div>
                            <label class="text-[9px] font-bold text-gray-400 uppercase">Giá (đ)</label>
                            <input type="number" id="editG-${index}" value="${p.price}" class="w-full border-b py-1 outline-none text-sm bg-transparent">
                        </div>
                        <div>
                            <label class="text-[9px] font-bold text-gray-400 uppercase">Mùi hương</label>
                            <input type="text" id="editM-${index}" value="${p.scent}" class="w-full border-b py-1 outline-none text-sm bg-transparent">
                        </div>
                        <div class="lg:col-span-1">
                            <label class="text-[9px] font-bold text-gray-400 uppercase">Link ảnh</label>
                            <input type="text" id="editI-${index}" value="${p.image}" class="w-full border-b py-1 outline-none text-[10px] bg-transparent text-blue-500">
                        </div>
                        <div class="flex gap-2 lg:col-span-2">
                            <button onclick="app.saveEdit(${index})" class="flex-1 bg-green-600 text-white py-2 rounded-lg text-[10px] font-bold uppercase">Cập nhật</button>
                            <button onclick="app.delP(${p.id})" class="p-2 text-red-300 hover:text-red-500"><i data-lucide="trash-2"></i></button>
                        </div>
                    </div>`).join('')}
            </div>
        </div>`;
    if (window.lucide) lucide.createIcons();
},
saveEdit(index) {
    const newName = document.getElementById(`editN-${index}`).value;
    const newPrice = parseInt(document.getElementById(`editG-${index}`).value);
    const newScent = document.getElementById(`editM-${index}`).value;
    const newImage = document.getElementById(`editI-${index}`).value;

    if(!newName || !newPrice) return alert("Không được để trống Tên và Giá!");

    // Cập nhật vào mảng sản phẩm
    this.products[index].name = newName;
    this.products[index].price = newPrice;
    this.products[index].scent = newScent;
    this.products[index].image = newImage;

    // Lưu lại vào LocalStorage để khách hàng thấy giá mới ngay lập tức
    localStorage.setItem('a4Products', JSON.stringify(this.products));
    
    alert("Đã cập nhật sản phẩm thành công!");
    
    // Render lại Dashboard để cập nhật giao diện mà không làm mất thanh điều hướng
    this.renderAdminDashboard(document.getElementById('app'));
},
async renderAdminOrders(container) {
    if(!this.isAdmin) return this.showPage('admin-login');
    container.innerHTML = `<div class="p-20 text-center">⏳ Đang lấy danh sách đơn hàng...</div>`;

    try {
        const querySnapshot = await window.fb.getDocs(window.fb.collection(window.fb.db, "orders"));
        let html = `
            <div class="max-w-6xl mx-auto px-4 py-12 animate__animated animate__fadeIn">
                <div class="flex gap-4 mb-8 border-b pb-4">
                    <button onclick="app.renderAdminDashboard(document.getElementById('app'))" class="font-bold text-gray-400 hover:text-amber-700 pb-2">📦 Sản phẩm</button>
                    <button onclick="app.renderAdminOrders(document.getElementById('app'))" class="font-bold text-amber-900 border-b-2 border-amber-900 pb-2">📋 Đơn hàng & Tiến độ</button>
                </div>
                <div class="space-y-4">`;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            html += `
                <div class="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
                    <div>
                        <p class="font-bold text-amber-900">${data.customerName} (#${doc.id.slice(0,5)})</p>
                        <p class="text-xs text-gray-500">SĐT: ${data.phone} | ĐC: ${data.address}</p>
                        <p class="text-sm font-bold mt-1 text-red-600">Tổng: ${data.totalPrice.toLocaleString()}đ</p>
                    </div>
                    <select onchange="app.updateStatus('${doc.id}', this.value)" class="bg-amber-50 border rounded-xl px-4 py-2 text-sm font-bold outline-none">
                        <option value="Đang xử lý" ${data.status === 'Đang xử lý' ? 'selected' : ''}>Đang xử lý</option>
                        <option value="Đang chuẩn bị" ${data.status === 'Đang chuẩn bị' ? 'selected' : ''}>Đang chuẩn bị</option>
                        <option value="Đang giao" ${data.status === 'Đang giao' ? 'selected' : ''}>Đang giao</option>
                        <option value="Thành công" ${data.status === 'Thành công' ? 'selected' : ''}>Thành công</option>
                    </select>
                </div>`;
        });
        container.innerHTML = html + `</div></div>`;
    } catch (e) { container.innerHTML = "Lỗi tải đơn hàng!"; }
    if (window.lucide) lucide.createIcons();
},

async updateStatus(orderId, newStatus) {
    try {
        await window.fb.setDoc(window.fb.doc(window.fb.db, "orders", orderId), { status: newStatus }, { merge: true });
        alert("Đã cập nhật tiến độ cho khách!");
    } catch (e) { alert("Lỗi cập nhật!"); }
},

async updateStatus(id, newStatus) {
    try {
        await window.fb.setDoc(window.fb.doc(window.fb.db, "orders", id), { status: newStatus }, { merge: true });
        alert("Đã cập nhật tiến độ!");
    } catch (e) { alert("Lỗi cập nhật!"); }
},
async updateOrderStatus(orderId, newStatus) {
    try {
        const orderRef = window.fb.doc(window.fb.db, "orders", orderId);
        await window.fb.setDoc(orderRef, { status: newStatus }, { merge: true });
        alert("Đã cập nhật tiến độ cho khách hàng!");
    } catch (e) { alert("Lỗi cập nhật!"); }
}
    
};
document.addEventListener('DOMContentLoaded', () => app.init());