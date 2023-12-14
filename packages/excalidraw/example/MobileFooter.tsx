import { ExcalidrawImperativeAPI } from "../types";
import CustomFooter from "./CustomFooter";
console.log(window.ExcalidrawLib, "MOBILE");
const { useDevice, Footer } = window.ExcalidrawLib;

const MobileFooter = ({
  excalidrawAPI,
}: {
  excalidrawAPI: ExcalidrawImperativeAPI;
}) => {
  const device = useDevice();
  if (device.editor.isMobile) {
    return (
      <Footer>
        <CustomFooter excalidrawAPI={excalidrawAPI} />
      </Footer>
    );
  }
  return null;
};
export default MobileFooter;
