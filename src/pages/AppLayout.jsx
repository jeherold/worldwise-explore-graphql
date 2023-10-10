import styles from "./AppLayout.module.css";
import Map from "../components/Map";
import Sidebar from "../components/Sidebar";
import UserGithub from "../components/UserGithub";

function AppLayout() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
      <UserGithub />
    </div>
  );
}

export default AppLayout;
