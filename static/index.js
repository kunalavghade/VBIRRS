// Jquery for convenience
$(document).ready(function () {
	console.log("Loaded");
	const nav = $("nav");
	const canvas = $("#canvas-ctrl canvas")[0];
	const videoTag = $("#video-ctrl video")[0];
	let localStream;
	let width, height;
	let streaming = false;
	$(".nav-link.current").removeClass("current");
	// Add active class to the tag on window loaded
	$(`.nav-link[href='${window.location.pathname}']`).addClass("current");
	$("#open").click(function () {
		nav.addClass("active");
	});
	$("#close").click(function () {
		nav.removeClass("active");
	});
	// To do stream into entire viewport (Kinda a camera application one similar to iOS)
	$("#cambtn").click(function () {
		// Checks if browser has media devices if so get one to stream
		navigator.mediaDevices
			// Streams an hd video
			.getUserMedia({
				video: { width: { ideal: 4096 }, height: { ideal: 2160 } },
				audio: false,
			}) // Recieves a media stream if we have access to camera
			.then((stream) => {
				// Stream the camera to video tag
				// This will be our viewer or helper for the stream
				videoTag.srcObject = stream;
				localStream = stream;
				videoTag.play();
			}) // If there's any error we will log this (Todo alert the user instead of logging)
			.catch((err) => {
				console.error(`An error occurred: ${err}`);
			});
		// Whenever video is ready to stream we will make the changes of width and height
		videoTag.addEventListener("canplay", (ev) => {
			if (!streaming) {
				width = videoTag.offsetWidth;
				height =
					(videoTag.videoHeight / videoTag.videoWidth) * videoTag.offsetWidth;

				videoTag.setAttribute("width", width);
				videoTag.setAttribute("height", height);
				canvas.setAttribute("width", width);
				canvas.setAttribute("height", height);
				streaming = true;
			}
		});
	});
	// Capture the current stream and draw an image on the canvas for the user to view it.
	// This canvas will be scaled down (css transform) but the aspect ratio will be maintained
	$("#capture").click(function () {
		const context = canvas.getContext("2d");
		context.drawImage(videoTag, 0, 0, canvas.width, canvas.height);
	});
	// Stops the video stream and generates the image file which would be able to download
	// To do: Look for another option such as sending the image using ajax
	$("#stop").click(function () {
		videoTag.pause();
		videoTag.srcObject = null;
		localStream.getTracks()[0].stop();
		const a = document.createElement("a");
		a.download = "file.png";
		a.href = canvas.toDataURL();
		a.click();
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
	});
});
