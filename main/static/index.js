// Jquery for convenience
$(function () {
	// Global ajax setup
	$.ajaxSetup({
		headers: {
			"X-CSRFToken": getCookie("csrftoken"),
		},
	});
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
	$("#open").on("click", function () {
		nav.addClass("active");
	});
	$("#close").on("click", function () {
		nav.removeClass("active");
	});
	// To do stream into entire viewport (Kinda a camera application one similar to iOS)
	$("#cambtn").on("click", function () {
		// Checks if browser has media devices if so get one to stream
		navigator.mediaDevices
			// Streams an hd video
			.getUserMedia({
				video: { width: { ideal: 1920 } },
				audio: false,
			}) // Recieves a media stream if we have access to camera
			.then((stream) => {
				// Stream the camera to video tag
				// This will be our viewer or helper for the stream
				videoTag.srcObject = stream;
				localStream = stream;
			})
			// If there's any error we will log this (Todo alert the user instead of logging)
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
				console.log(width, height);
				videoTag.play();

				streaming = true;
			}
		});
	});
	// Capture the current stream and draw an image on the canvas for the user to view it.
	// This canvas will be scaled down (css transform) but the aspect ratio will be maintained
	$("#capture").on("click", function () {
		const context = canvas.getContext("2d");
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		canvas.setAttribute("width", width * 0.45);
		canvas.setAttribute("height", height * 0.5);
		context.drawImage(videoTag, 0, 0, canvas.width, canvas.height);
		console.log(canvas.width, canvas.height);
		document
			.getElementById("webimg")
			.setAttribute("value", canvas.toDataURL("image/png"));
	});
	// Stops the video stream and generates the image file which would be able to download
	// To do: Look for another option such as sending the image using ajax
	$("#stop").on("click", function () {
		videoTag.pause();
		videoTag.srcObject = null;
		localStream.getTracks()[0].stop();
		// const a = document.createElement("a");
		// a.download = "file.png";
		// a.href = canvas.toDataURL();

		// a.on("click");
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
	});

	// ajax calls
	function getCookie(c_name) {
		if (document.cookie.length > 0) {
			c_start = document.cookie.indexOf(c_name + "=");
			if (c_start != -1) {
				c_start = c_start + c_name.length + 1;
				c_end = document.cookie.indexOf(";", c_start);
				if (c_end == -1) c_end = document.cookie.length;
				return unescape(document.cookie.substring(c_start, c_end));
			}
		}
		return "";
	}
	$("form[name='inputForm']").on("submit", function (evt) {
		evt.preventDefault();
		const form = new FormData($(this)[0]);
		$.ajax({
			url: "/main",
			method: "POST",
			data: form,
			processData: false,
			contentType: false,
			cache: false,
			success: function (data) {
				console.log("success");
				console.log(data);
			},
			error: function (data) {
				console.log("error");
				console.log(data);
			},
		});
		console.log(form);
		console.log("Form Submitting..");
	});
});
