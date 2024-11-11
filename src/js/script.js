// src/js/script.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('awardForm');
    const loading = document.getElementById('loading'); // 로딩 스피너 요소
    const errorMessage = document.getElementById('errorMessage'); // 오류 메시지 요소

    console.log('errorMessage:', errorMessage); // 디버깅용 로그

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        loading.style.display = 'inline'; // 로딩 스피너 표시
        errorMessage.style.display = 'none'; // 오류 메시지 숨김

        try {
            const formData = {
                contestName: document.getElementById('contestName').value,
                studentName: document.getElementById('studentName').value,
                studentId: document.getElementById('studentId').value,
                additionalInfo: document.getElementById('additionalInfo')?.value || '',
            };

            console.log('formData:', formData); // 전송할 데이터 확인

            const response = await fetch('/.netlify/functions/submit-form', { // 상대 URL 사용
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // 데이터를 JSON 문자열로 변환
            });

            loading.style.display = 'none'; // 로딩 스피너 숨김

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                form.reset(); // 폼 초기화
            } else {
                alert('데이터 저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            loading.style.display = 'none'; // 로딩 스피너 숨김
            errorMessage.style.display = 'block'; // 오류 메시지 표시
            errorMessage.textContent = '오류가 발생했습니다.';
        }
    });
});