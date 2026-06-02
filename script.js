// 등록 폼 처리
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('studentName').value,
        email: document.getElementById('studentEmail').value,
        phone: document.getElementById('studentPhone').value,
        course: document.getElementById('courseSelect').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toLocaleString('ko-KR')
    };
    
    // 로컬스토리지에 저장
    let registrations = JSON.parse(localStorage.getItem('registrations')) || [];
    registrations.push(formData);
    localStorage.setItem('registrations', JSON.stringify(registrations));
    
    // 성공 메시지 표시
    const messageDiv = document.getElementById('registerMessage');
    messageDiv.textContent = '✓ 등록이 완료되었습니다! 곧 연락드리겠습니다.';
    messageDiv.className = 'message success';
    
    // 폼 초기화
    this.reset();
    
    // 3초 후 메시지 숨김
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 3000);
});

// 리뷰 폼 처리
document.getElementById('reviewForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const rating = document.getElementById('reviewRating').value;
    
    if (rating === '0') {
        alert('별점을 선택해주세요!');
        return;
    }
    
    const reviewData = {
        name: document.getElementById('reviewName').value,
        rating: rating,
        text: document.getElementById('reviewText').value,
        timestamp: new Date().toLocaleString('ko-KR')
    };
    
    // 로컬스토리지에 저장
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.push(reviewData);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    // 리뷰 리스트에 추가
    addReviewToList(reviewData);
    
    // 폼 초기화
    this.reset();
    document.getElementById('reviewRating').value = '0';
    resetStars();
    
    alert('리뷰가 등록되었습니다!');
});

// 별점 선택 기능
const stars = document.querySelectorAll('.star');
stars.forEach(star => {
    star.addEventListener('click', function() {
        const rating = this.dataset.value;
        document.getElementById('reviewRating').value = rating;
        
        stars.forEach(s => {
            if (s.dataset.value <= rating) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    });
    
    star.addEventListener('mouseover', function() {
        const rating = this.dataset.value;
        stars.forEach(s => {
            if (s.dataset.value <= rating) {
                s.style.color = '#C41E3A';
            } else {
                s.style.color = '#ddd';
            }
        });
    });
});

document.getElementById('ratingStars').addEventListener('mouseout', function() {
    const currentRating = document.getElementById('reviewRating').value;
    stars.forEach(s => {
        if (s.dataset.value <= currentRating) {
            s.style.color = '#C41E3A';
        } else {
            s.style.color = '#ddd';
        }
    });
});

function resetStars() {
    stars.forEach(s => s.classList.remove('active'));
}

// 리뷰를 리스트에 추가
function addReviewToList(reviewData) {
    const container = document.getElementById('reviews-container');
    const reviewItem = document.createElement('div');
    reviewItem.className = 'review-item';
    
    const starsDisplay = '★'.repeat(reviewData.rating) + '☆'.repeat(5 - reviewData.rating);
    
    reviewItem.innerHTML = `
        <div class="review-header">
            <span class="review-name">${escapeHtml(reviewData.name)}</span>
            <span class="review-rating">${starsDisplay}</span>
        </div>
        <p class="review-text">${escapeHtml(reviewData.text)}</p>
        <div class="review-time">${reviewData.timestamp}</div>
    `;
    
    container.insertBefore(reviewItem, container.firstChild);
}

// 저장된 리뷰 로드
function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const container = document.getElementById('reviews-container');
    
    if (reviews.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해주세요!</p>';
        return;
    }
    
    reviews.reverse().forEach(review => {
        addReviewToList(review);
    });
}

// 파일 업로드 처리
document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('fileInput');
    const titleInput = document.getElementById('fileTitle');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('파일을 선택해주세요!');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const uploadData = {
            title: titleInput.value,
            image: event.target.result,
            timestamp: new Date().toLocaleString('ko-KR')
        };
        
        // 로컬스토리지에 저장
        let uploads = JSON.parse(localStorage.getItem('uploads')) || [];
        uploads.push(uploadData);
        localStorage.setItem('uploads', JSON.stringify(uploads));
        
        // 업로드된 파일 표시
        displayUploadedFile(uploadData);
        
        // 폼 초기화
        fileInput.value = '';
        titleInput.value = '';
        
        alert('파일이 업로드되었습니다!');
    };
    
    reader.readAsDataURL(file);
});

// 업로드된 파일 표시
function displayUploadedFile(uploadData) {
    const container = document.getElementById('uploadedFiles');
    const fileItem = document.createElement('div');
    fileItem.className = 'uploaded-file';
    
    fileItem.innerHTML = `
        <img src="${uploadData.image}" alt="${uploadData.title}">
        <p>${escapeHtml(uploadData.title)}</p>
        <small style="color: #999;">${uploadData.timestamp}</small>
    `;
    
    container.insertBefore(fileItem, container.firstChild);
}

// 저장된 파일 로드
function loadUploadedFiles() {
    const uploads = JSON.parse(localStorage.getItem('uploads')) || [];
    uploads.reverse().forEach(upload => {
        displayUploadedFile(upload);
    });
}

// XSS 방지를 위한 HTML 이스케이프
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 페이지 로드 시 저장된 데이터 불러오기
document.addEventListener('DOMContentLoaded', function() {
    loadReviews();
    loadUploadedFiles();
});

// 부드러운 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
