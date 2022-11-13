






async function record() {

    


    let shouldStop = false;
        let stopped = false;
        const videoElement = document.getElementsByTagName("video")[0];
        const downloadLink = document.getElementById('download');
        const stopButton = document.getElementById('stop');
        function startRecord() {
            $('.btn-info').prop('disabled', true);
            $('#stop').prop('disabled', false);
            $('#download').css('display', 'none')
        }
        function stopRecord() {
            $('.btn-info').prop('disabled', false);
            $('#stop').prop('disabled', true);
            $('#download').css('display', 'block')
        }
        const audioRecordConstraints = {
            echoCancellation: true
        }

        stopButton.addEventListener('click', function () {
            shouldStop = true;
        });

        const handleRecord = function ({stream, mimeType}) {
            startRecord()
            let recordedChunks = [];
            stopped = false;
            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = function (e) {
                if (e.data.size > 0) {
                    recordedChunks.push(e.data);
                }

                if (shouldStop === true && stopped === false) {
                    mediaRecorder.stop();
                    stopped = true;
                }
            };

            mediaRecorder.onstop = function () {
                const blob = new Blob(recordedChunks, {
                    type: mimeType
                });
                recordedChunks = []
                const filename = window.prompt('Enter file name');
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = `${filename || 'recording'}.webm`;
                stopRecord();
                videoElement.srcObject = null;
            };

            mediaRecorder.start(200);
        };

    
        recordScreen();
        async function recordScreen() {
            const mimeType = 'video/webm';
            shouldStop = false;
            const constraints = {
                video: {
                    cursor: 'motion'
                }
            };
            
            if(!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)) {
                return window.alert('Screen Record not supported!')
            }
            
            let stream = null;
            const displayStream = await navigator.mediaDevices.getDisplayMedia({video: {frameRate: { max: 60 }, width: { ideal: 1920, max: 1920 }, height: { ideal: 1080, max: 1080 }}, audio: {'echoCancellation': false, frameRate: { max: 60 },}});
            console.log(displayStream)

            if(window.confirm("Record audio with screen?")){
                const audioContext = new AudioContext();

                //const voiceStream = await navigator.mediaDevices.getUserMedia({ audio: {'echoCancellation': true}, video: false });
                //const userAudio = audioContext.createMediaStreamSource(voiceStream);
                
                const audioDestination = audioContext.createMediaStreamDestination();
            //  userAudio.connect(audioDestination);

                if(displayStream.getAudioTracks().length > 0) {
                    const displayAudio = audioContext.createMediaStreamSource(displayStream);
                    displayAudio.connect(audioDestination);
                }

                console.log(audioDestination)

                // console.log(...displayStream.getVideoTracks())
                // console.log(...audioDestination.stream.getTracks())

                const tracks = [...displayStream.getVideoTracks(), ...audioDestination.stream.getTracks()]
                stream = new MediaStream(tracks);
                handleRecord({stream, mimeType})
            } else {
                stream = displayStream;
                handleRecord({stream, mimeType});
            };
            videoElement.srcObject = stream;
        }

    }