
import { Link } from "react-router-dom";
import { API_DOMAIN, authService } from "../services/auth";
import classNames from "classnames";
import { UserSLA } from "ababil-landbouw";
import { useState } from "react";
import styles from "./SLA2023.module.scss";

export default function SLA2023() {
    const [modified, setModified] = useState(false);
    const user: UserSLA = authService.getLogin() as UserSLA;
    const [kehadiran, setKehadiran] = useState(user && user.kehadiran ? user.kehadiran : -1);
    const isViewChart = (user && user.Roles && user.Roles.includes("view.chart"));
    const isSLA2023day = (new Date()).getTime() >= (new Date('09/02/2023')).getTime();

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
                <img className={styles.avatarImg} src="/bg-2024-panitia.png" alt="panitia" />
            </div>
            <i className="fa fa-calendar-days"></i>&nbsp; Sabtu, 2 September 2023<br />
            <i className="fa fa-clock"></i>&nbsp; Jam 10:00 s/d salasai<br />
            <a target='_blank' rel='noopener noreferrer' href="https://goo.gl/maps/yY3ooQhRPzgkiNYw8" className={styles.link}><i className="fa fa-location-dot"></i>&nbsp; Balai Sarbini, Jakarta</a>
            <hr />
            {user && user.Alumni ? (
                <div>
                    {!isSLA2023day && (
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

                    {(isViewChart || isSLA2023day) && (
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