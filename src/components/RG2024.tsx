
import { Link } from "react-router-dom";
import { API_DOMAIN, authService } from "../services/auth";
import classNames from "classnames";
import { UserSLA } from "ababil-landbouw";
import { useState } from "react";
import styles from "./RG2024.module.scss";
import logo from "../img/2024-logo.png";

export default function SLA2023() {
    const [modified, setModified] = useState(false);
    const user: UserSLA = authService.getLogin() as UserSLA;
    const [kehadiran, setKehadiran] = useState(user && user.kehadiran ? user.kehadiran : -1);
    const isViewChart = (user && user.Roles && user.Roles.includes("view.chart"));
    const isRG2024day = (new Date()).getTime() >= (new Date('09/13/2024')).getTime();

    const onKehadiranChange = (e: any) => {
        let value = Number(e.target.value);
        setKehadiran(value);
        setModified(value !== user.kehadiran);
    }

    const onSimpanKehadiran = (e: any) => {
        if (user) {
            authService.updateKehadiran({ kehadiran: kehadiran }).then(
                (result) => {
                    user.kehadiran = kehadiran;
                    authService.setLogin(user);
                    document.location.href = "/";
                }, (error) => {
                    console.log(error);
                }
            );
        }
    }

    return <div className={styles.container}>
        <div className={styles.center}>
            <div className={styles.avatar}>
                <img className={styles.avatarImg} src={logo} alt="panitia" />
            </div>
            <i className="fa fa-calendar-days"></i>&nbsp; Jumat, Sabtu & Minggu, 13-15 September 2024<br />
            <i className="fa fa-clock"></i>&nbsp; Jam 10:00 s/d selesai<br />
            <a target='_blank' rel='noopener noreferrer' href="https://maps.app.goo.gl/vYi5nyovL1Fio4M19" className={styles.link}><i className="fa fa-location-dot"></i>&nbsp; SMA-1 BUKITTINGGI</a>
            <hr />
            {user && user.Alumni ? (
                <div>
                    {!isRG2024day && (
                        <>
                            <b>Konfirmasi Kedatangan</b>
                            <div><label><input type="radio" value="1" checked={kehadiran === 1} onChange={onKehadiranChange} /> InsyaAllah Hadir</label></div>
                            <div><label><input type="radio" value="2" checked={kehadiran === 2} onChange={onKehadiranChange} /> Tidak Hadir</label></div>
                            <div className={classNames(styles.btnContainer, "mt-3")}>
                                {modified && (<button type="button" className={styles.btn} onClick={onSimpanKehadiran}>Simpan</button>)}
                                <button type="button" className={classNames(styles.btn)}>
                                    <Link to="/chart/confirmation">Data Konfirmasi</Link>
                                </button>
                            </div></>
                    )}

                    {/* <div><label><input type="radio" value="0" checked={kehadiran === 0} onChange={onKehadiranChange} /> Belum Tahu</label></div> */}

                    {(isViewChart || isRG2024day) && (
                        <button type="button" className={styles.btn}><Link to="/chart/presents">Lihat Kehadiran</Link></button>
                    )}
                    <button type="button" className={classNames(styles.btn)}>
                        <Link to="/">Tutup</Link>
                    </button>
                </div>
            ) : (
                <div className={classNames(styles.btnContainer, "mt-3")}>
                    <button type="button" className={classNames(styles.btn)}>
                        <Link to="/">Tutup</Link>
                    </button>
                </div>
            )}
        </div>
    </div>
}