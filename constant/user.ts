import type { IUser } from "~/types/IUser";

export const dummyUsers: IUser[] = [
    {
        id: 101,
        namaLengkap: "Akbar Pratama Suryamin",
        email: "akbar.surya@example.com",
        peran: "admin",
        statusAktif: true,
        tanggalDibuat: "2024-01-15T10:00:00Z",
        alamat: {
            jalan: "Jalan Kenanga No. 12",
            kota: "Jakarta",
            kodePos: "10110"
        }
    },
    {
        id: 102,
        namaLengkap: "Teguh Dwi Cahya",
        email: "teguh.dc@example.com",
        peran: "editor",
        statusAktif: true,
        tanggalDibuat: "2024-03-20T11:30:00Z",
        alamat: {
            jalan: "Gang Melati V No. 5",
            kota: "Bandung",
            kodePos: "40132"
        }
    },
    {
        id: 103,
        namaLengkap: "Farid Hidayat",
        email: "farid.h@example.com",
        peran: "member",
        statusAktif: false,
        tanggalDibuat: "2024-05-01T08:45:00Z",
        alamat: {
            jalan: "Perumahan Indah Blok C",
            kota: "Surabaya",
            kodePos: "60252"
        }
    },
    {
        id: 104,
        namaLengkap: "Siti Rahayu",
        email: "siti.rahayu@example.com",
        peran: "member",
        statusAktif: true,
        tanggalDibuat: "2024-04-10T15:20:00Z",
        alamat: {
            jalan: "Jalan Pahlawan 45",
            kota: "Yogyakarta",
            kodePos: "55281"
        }
    },
    {
        id: 105,
        namaLengkap: "Bambang Wijaya",
        email: "bambang.w@example.com",
        peran: "admin",
        statusAktif: false,
        tanggalDibuat: "2024-02-28T09:10:00Z",
        alamat: {
            jalan: "Griya Makmur No. 88",
            kota: "Semarang",
            kodePos: "50125"
        }
    }
];