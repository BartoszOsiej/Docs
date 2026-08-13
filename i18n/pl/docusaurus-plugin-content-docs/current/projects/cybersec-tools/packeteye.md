# PacketEye

Analizator ruchu oparty o pcap — przechwytywanie live lub parsowanie
offline ze statystykami per-IP/per-port.

## Przegląd

PacketEye czyta przechwyty pakietów (live lub z pliku `.pcap`) i produkuje
podsumowanie ruchu: sumy pakietów/bajtów, mix protokołów, liczniki
handshake TCP, top talkers i top porty. Wykonuje minimalny ręcznie pisany
parsing Ethernet → IPv4 → TCP/UDP/ICMP — wystarczający dla solidnych
statystyk bez ciężkich zależności.

## Użycie

```
packeteye live <iface> [count]   przechwytywanie live (count=0 dla nieskończoności)
packeteye file <dump.pcap>       parsowanie przechwytu offline

PRZYKŁADY:
  sudo packeteye live eth0
  packeteye file capture.pcap
  sudo packeteye live wlan0 1000
```

> **Uwaga:** przechwytywanie live wymaga roota/CAP_NET_RAW (lub
> równoważnych uprawnień dla interfejsu).

## Co raportuje

| Statystyka | Szczegóły |
|---|---|
| Pakiety / bajty | Całkowita objętość |
| Mix protokołów | Liczniki TCP / UDP / ICMP / inne |
| Handshake TCP | Liczniki SYN i SYN-ACK |
| Top talkers | Top 10 IP wg liczby pakietów |
| Top porty | Top 15 portów wg liczby pakietów |

## Parsowanie pakietów

Analizator rozumie:

- **Ethernet** — 14-bajtowy nagłówek, wysyłka wg EtherType (`0x0800` IPv4;
  `0x86dd` IPv6 pomijany dla szczegółowego parsowania)
- **IPv4** — parsowanie nagłówka wg IHL, pole protokołu, adresy źródła/celu
- **TCP** — porty źródła/celu, flagi SYN (`0x02`) i ACK (`0x10`)
- **UDP** — porty źródła/celu
- **ICMP** — tylko liczony

Całe parsowanie jest z kontrolą granic; ucięte pakiety są liczone,
ale pomijane.

## Przykładowe wyjście

```
[*] PacketEye 1.0.0 | nasłuch na eth0 (promisc)
[*] Ctrl+C aby zatrzymać

=== raport: live eth0 (1000 pkts) ===
packets: 1000 | bytes: 742133
protocols: tcp=812 udp=140 icmp=44 other=4
tcp handshakes: syn=23 synack=21

top talkers (wg pakietów):
     192.168.1.10          512
      10.0.0.1             240
        ...

top ports (wg portów):
  443        621
  80         132
  53          78
```

## Analiza offline

```bash
# Przechwyć tcpdumpem, analizuj offline
sudo tcpdump -i eth0 -w capture.pcap
packeteye file capture.pcap
```

## Uwagi implementacyjne

- `pcap::Capture::from_device` z trybem promiscuous, snaplen 65535,
  timeoutem 200 ms
- Pętla live traktuje `TimeoutExpired` jako „czekaj dalej”
- Statystyki używają `HashMap<Ipv4Addr, u64>` i `HashMap<u16, u64>`,
  sortowane malejąco przed drukowaniem
- Łagodne komunikaty błędów dla brakujących interfejsów lub nieczytelnych plików
