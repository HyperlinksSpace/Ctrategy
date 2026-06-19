# Quick Windows Core Audio diagnostics
$ErrorActionPreference = 'SilentlyContinue'

Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;

[ComImport, Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")]
class MMDeviceEnumeratorComObject { }

[Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IMMDeviceEnumerator {
    int NotNeeded();
    int GetDefaultAudioEndpoint(int dataFlow, int role, out IMMDevice ppDevice);
    [PreserveSig] int EnumAudioEndpoints(int dataFlow, int stateMask, out IntPtr ppDevices);
}

[Guid("D666063F-1587-4E43-81F1-B948E807363F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IMMDevice {
    int Activate(ref Guid iid, int dwClsCtx, IntPtr pActivationParams, [MarshalAs(UnmanagedType.IUnknown)] out object ppInterface);
    int OpenPropertyStore(int stgmAccess, out IntPtr ppProperties);
    int GetId([MarshalAs(UnmanagedType.LPWStr)] out string ppstrId);
    int GetState(out int pdwState);
}

[Guid("5CDF2C82-841E-4546-9722-0CF74078229A"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IAudioEndpointVolume {
    int NotNeeded1(); int NotNeeded2(); int NotNeeded3(); int NotNeeded4();
    int SetMasterVolumeLevel(float fLevelDB, ref Guid pguidEventContext);
    int SetMasterVolumeLevelScalar(float fLevel, ref Guid pguidEventContext);
    int GetMasterVolumeLevel(out float pfLevelDB);
    int GetMasterVolumeLevelScalar(out float pfLevel);
    int SetChannelVolumeLevel(uint nChannel, float fLevelDB, ref Guid pguidEventContext);
    int SetChannelVolumeLevelScalar(uint nChannel, float fLevel, ref Guid pguidEventContext);
    int GetChannelVolumeLevel(uint nChannel, out float pfLevelDB);
    int GetChannelVolumeLevelScalar(uint nChannel, out float pfLevel);
    int SetMute([MarshalAs(UnmanagedType.Bool)] bool bMute, ref Guid pguidEventContext);
    int GetMute(out bool pbMute);
}

[Guid("870AF99C-171D-4F9E-AF0D-E63DF40C2BC9"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IMMEndpoint {
    int GetDataFlow(out int pDataFlow);
}

public static class AudioDiag {
    public static void DumpEndpoint(int flow, int role, string label) {
        var en = (IMMDeviceEnumerator)new MMDeviceEnumeratorComObject();
        IMMDevice dev;
        if (en.GetDefaultAudioEndpoint(flow, role, out dev) != 0) {
            Console.WriteLine(label + ": <none>");
            return;
        }
        string id;
        dev.GetId(out id);
        int state;
        dev.GetState(out state);
        var iid = typeof(IAudioEndpointVolume).GUID;
        object obj;
        dev.Activate(ref iid, 23, IntPtr.Zero, out obj);
        var vol = (IAudioEndpointVolume)obj;
        float scalar;
        vol.GetMasterVolumeLevelScalar(out scalar);
        bool mute;
        vol.GetMute(out mute);
        Console.WriteLine(string.Format("{0}: id={1} state={2} volume={3:P0} muted={4}", label, id, state, scalar, mute));
    }
}
'@

Write-Host "=== Default audio endpoints (Core Audio) ==="
[AudioDiag]::DumpEndpoint(0, 0, "Playback  (Console)")
[AudioDiag]::DumpEndpoint(0, 1, "Playback  (Multimedia)")
[AudioDiag]::DumpEndpoint(0, 2, "Playback  (Communications)")
[AudioDiag]::DumpEndpoint(1, 0, "Recording (Console)")
[AudioDiag]::DumpEndpoint(1, 1, "Recording (Multimedia)")
[AudioDiag]::DumpEndpoint(1, 2, "Recording (Communications)")

Write-Host "`n=== MMDevices render (active only) ==="
$propGuid = '{a45c254e-df1c-4efd-8020-67d146a850e0},2'
$base = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render'
Get-ChildItem $base | ForEach-Object {
    $state = (Get-ItemProperty -Path $_.PSPath).DeviceState
    if ($state -ne 1) { return }
    $name = (Get-ItemProperty -Path (Join-Path $_.PSPath 'Properties')).$propGuid
    Write-Host ("ACTIVE OUTPUT: {0} ({1})" -f $name, $_.PSChildName)
}

Write-Host "`n=== MMDevices capture (active only) ==="
$base = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Capture'
Get-ChildItem $base | ForEach-Object {
    $state = (Get-ItemProperty -Path $_.PSPath).DeviceState
    if ($state -ne 1) { return }
    $name = (Get-ItemProperty -Path (Join-Path $_.PSPath 'Properties')).$propGuid
    Write-Host ("ACTIVE INPUT:  {0} ({1})" -f $name, $_.PSChildName)
}

Write-Host "`n=== ASUS / Armoury processes ==="
Get-Process | Where-Object { $_.ProcessName -match 'Armoury|Denoise|CMedia' } |
    Select-Object ProcessName, Id | Format-Table -AutoSize
