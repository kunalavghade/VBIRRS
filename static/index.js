// Jquery for convenience
$(function () {
	// Global ajax setup
	const mobileAndTabletCheck = function () {
		let check = false;
		(function (a) {
			if (
				/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
					a
				) ||
				/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
					a.substr(0, 4)
				)
			)
				check = true;
		})(navigator.userAgent || navigator.vendor || window.opera);
		return check;
	};
	console.log("Loaded", mobileAndTabletCheck());
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
	$("#capture").on("click", function () {
		const anch = document.createElement("a");
		anch.download = `capture-${new Date().toJSON()}.jpg`;
		const context = canvas.getContext("2d");
		context.drawImage(videoTag, 0, 0, canvas.width, canvas.height);
		videoTag.pause();
		videoTag.srcObject = null;
		localStream.getTracks()[0].stop();
		canvas.toBlob((blob) => {
			anch.href = URL.createObjectURL(blob);
			anch.click();
			canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		}, "image/jpg");
	});
	// $("#image-form").on("submit", function (e) {

	// });
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
});
