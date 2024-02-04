let uploadedSvgCount = 0;

const generateGrid = () => {
  const textInput = document.getElementById("textInput").innerText;
  const totalSegments = document.getElementById("totalSegments").value;
  const gridContainer = document.getElementById("grid-container");

  gridContainer.innerHTML = "";
  const textLength = textInput.length;
  const binaryLength = 8;

  // Update the CSS grid-template-columns property dynamically
  gridContainer.style.gridTemplateColumns = `repeat(${totalSegments}, 1fr)`;

  const createGridItem = (char, binaryRepresentation) => {
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");

    const svgCount = binaryRepresentation.split("1").length - 1;

    for (let i = 1; i <= svgCount; i++) {
      const svgContent = localStorage.getItem(`uploadedSvg_${i}`);
      const svgContainer = document.createElement("div");
      svgContainer.innerHTML = svgContent;
      gridItem.appendChild(svgContainer);
    }

    return gridItem;
  };

  for (let i = 0; i < textLength; i++) {
    const char = textInput.charCodeAt(i % textLength);
    const binaryRepresentation = char.toString(2).padStart(binaryLength, "0");
    const gridItem = createGridItem(char, binaryRepresentation);
    gridContainer.appendChild(gridItem);
  }
};

// Function to update the grid live as the slider is moved
const updateGrid = () => {
  generateGrid();
};

const handleSvgUpload = () => {
  const svgInput = document.getElementById("svgInput");
  const uploadedSvgContainer = document.getElementById("uploadedSvgContainer");

  uploadedSvgContainer.innerHTML = ""; // Clear previous content

  if (svgInput.files.length > 0) {
    for (let i = 0; i < svgInput.files.length; i++) {
      const uploadedSvgFile = svgInput.files[i];
      const reader = new FileReader();

      reader.onload = (event) => {
        const uploadedSvgContent = event.target.result;

        // Display the uploaded SVGs
        const svgContainer = document.createElement("div");
        svgContainer.innerHTML = uploadedSvgContent;
        uploadedSvgContainer.appendChild(svgContainer);

        // Save the uploaded SVGs to local storage
        localStorage.setItem(`uploadedSvg_${i + 1}`, uploadedSvgContent);

        uploadedSvgCount++;

        if (uploadedSvgCount === 8) {
          // Disable the file input or provide visual indication
          svgInput.disabled = true;

          // Show the alert only once after all SVGs are uploaded
          alert("All SVGs uploaded and saved!");

          // Update the "Generate Grid" button status after all SVGs are uploaded
          updateGenerateGridButton();
        }
      };

      // Read the SVG file as text
      reader.readAsText(uploadedSvgFile);
    }
  } else {
    alert("Please select at least one SVG file.");
  }
};

// Function to update the "Generate Grid" button status
const updateGenerateGridButton = () => {
  const generateGridButton = document.getElementById("b1");
  generateGridButton.disabled = !isValidInput();
};

// Event listener for text input changes
document
  .getElementById("textInput")
  .addEventListener("input", updateGenerateGridButton);

// Function to check if conditions are met for enabling the "Generate Grid" button
const isValidInput = () => {
  const textInput = document.getElementById("textInput").innerText.trim();
  return uploadedSvgCount === 8 && textInput !== "";
};

// Function to create img element
const createImgElement = (src, onloadCallback) => {
  const img = document.createElement("img");
  img.setAttribute("src", src);
  img.setAttribute("class", "svg-element");
  img.onload = onloadCallback;
  return img;
};

// Function to save the grid as PNG
const saveAsPNG = () => {
  const gridContainer = document.getElementById("grid-container");

  html2canvas(gridContainer).then((canvas) => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = "grid.png";
    link.click();
  });
};

// Clear local storage on page unload
window.addEventListener("beforeunload", () => {
  localStorage.clear();
});
