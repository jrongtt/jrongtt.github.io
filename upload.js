export function upload_midi() {
        if (
        	!(
        		window.File &&
        		window.FileReader &&
        		window.FileList &&
        		window.Blob
        	)
        ) {
        	document.querySelector("#FileDrop #Text").textContent =
        		"Reading files not supported by this browser";
        } else {
        	const fileDrop = document.querySelector("#FileDrop");

        	fileDrop.addEventListener("dragenter", () =>
        		fileDrop.classList.add("Hover")
        	);

        	fileDrop.addEventListener("dragleave", () =>
        		fileDrop.classList.remove("Hover")
        	);

        	fileDrop.addEventListener("drop", () =>
        		fileDrop.classList.remove("Hover")
        	);

        	document
        		.querySelector("#FileDrop input")
        		.addEventListener("change", (e) => {
                    console.log("ASDDASDAS")
        			//get the files
        			const files = e.target.files;
        			if (files.length > 0) {
        				const file = files[0];
        				document.querySelector(
        					"#FileDrop #Text"
        				).textContent = file.name;
        				parseFile(file);
        			}
        		});
        }

        let currentMidi = null;

        function parseFile(file) {
        	//read the file
        	const reader = new FileReader();
        	reader.onload = function (e) {
        		const midi = new Midi(e.target.result);
        		document.querySelector(
        			"#ResultsText"
        		).value = JSON.stringify(midi, undefined, 2);
                console.log(JSON.stringify(midi, undefined, 2));
                // const returnOrderArray = () => {(JSON.stringify(midi, undefined, 2))}
        		// module.exports = returnOrderArray
                document
        			.querySelector("tone-play-toggle")

        		currentMidi = midi;
        	};
        	reader.readAsArrayBuffer(file);
        }
    }