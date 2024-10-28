document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('awardForm');
    const loading = document.querySelector('.loading');
    const errorMessage = document.querySelector('.error-message');
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 파일 크기 2MB 제한

    // 파일 미리보기 함수
    function handleFilePreview(fileInput, previewDiv) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewDiv.innerHTML = `<img src="${e.target.result}" style="max-width: 100%;">`;
                };
                reader.readAsDataURL(file);
            } else {
                previewDiv.innerHTML = `<p>${file.name}</p>`;
            }
        });
    }

    // 파일 크기 검사 함수
    function validateFileSize(file) {
        if (file.size > MAX_FILE_SIZE) {
            alert("파일 크기는 2MB 이하로 제한됩니다.");
            return false;
        }
        return true;
    }

    // 미리보기 핸들링
    handleFilePreview(document.getElementById('awardPhoto'), document.getElementById('photoPreview'));
    handleFilePreview(document.getElementById('certDocument'), document.getElementById('docPreview'));

    // 파일 크기 제한 검사
    document.getElementById('awardPhoto').addEventListener('change', (e) => {
        if (!validateFileSize(e.target.files[0])) {
            e.target.value = ''; // 유효하지 않으면 초기화
        }
    });
    document.getElementById('certDocument').addEventListener('change', (e) => {
        if (!validateFileSize(e.target.files[0])) {
            e.target.value = ''; // 유효하지 않으면 초기화
        }
    });

    // 폼 제출 처리
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return; 
        }

        loading.style.display = 'inline';
        errorMessage.style.display = 'none';

        try {
            const formData = new FormData(form);
            //https://hknu-ss-awards.netlify.app/
            //Netlify Functions를 호출하도록 URL 설정
            //a
            const response = await fetch('../functions/submit-form.js', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('제출 중 오류가 발생했습니다.');
            }

            const result = await response.json();
            alert('성공적으로 제출되었습니다!');
            form.reset();
            document.getElementById('photoPreview').innerHTML = '';
            document.getElementById('docPreview').innerHTML = '';

        } catch (error) {
            errorMessage.style.display = 'inline';
            errorMessage.textContent = error.message;
        } finally {
            loading.style.display = 'none';
        }
    });
});
