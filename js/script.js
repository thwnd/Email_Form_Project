const form = document.getElementById('awardForm');
        const loading = document.querySelector('.loading');

        // 파일 미리보기 처리
        function handleFilePreview(fileInput, previewDiv) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        previewDiv.innerHTML = `<img src="${e.target.result}" 
                                                   style="max-width: 100%;">`;
                    };
                    reader.readAsDataURL(file);
                } else {
                    previewDiv.innerHTML = `<p>${file.name}</p>`;
                }
            });
        }

        handleFilePreview(
            document.getElementById('awardPhoto'), 
            document.getElementById('photoPreview')
        );
        handleFilePreview(
            document.getElementById('certDocument'), 
            document.getElementById('docPreview')
        );

        // 폼 제출 처리
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // 기본 유효성 검사
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            loading.style.display = 'inline';

            try {
                const formData = new FormData(form);

                // API 엔드포인트로 데이터 전송
                const response = await fetch('/api/submit-award', {
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
                alert(error.message);
            } finally {
                loading.style.display = 'none';
            }
        });