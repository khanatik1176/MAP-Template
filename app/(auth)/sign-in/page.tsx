'use client';
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Circle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BaseInput } from "@/components/BaseInput";
import { SignInSchema } from "@/schema/Auth.Schema";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { handleSignIn } from "@/helpers/Auth.Api";
import { TSignInFormInputs } from "@/types/Auth.types";
import 'leaflet/dist/leaflet.css';
import Image from "next/image";
import Logo from '../../../public/logo/ACI-Logo.png';

type MapSimulationProps = {
  className?: string;
};

function MapSimulation({ className }: MapSimulationProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;

    // A path for the moving marker (within Bangladesh)
    const path: [number, number][] = [
      [23.8103, 90.4125], // Dhaka
      [24.9045, 91.8611], // Sylhet
      [25.7439, 89.2752], // Rangpur-ish
      [24.3745, 88.6042], // Rajshahi
      [22.8456, 89.5403], // Khulna
      [22.3569, 91.7832], // Chattogram
      [23.8103, 90.4125], // back to Dhaka
    ];

    import('leaflet').then((L) => {
      if (!mounted) return;

      // Center roughly in the middle of Bangladesh and pick a zoom that shows whole country
      const center: [number, number] = [24.0, 90.5];
      const fixedZoom = 7;

      const map = L.map(mapRef.current as HTMLElement, {
        center,
        zoom: fixedZoom,
        zoomControl: false,
        attributionControl: false,
        dragging: true,
      });
      leafletMapRef.current = map;

      // Prevent zooming by gestures or controls
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.touchZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      // Force min/max zoom to fixed value (extra safety)
      map.setMinZoom(fixedZoom);
      map.setMaxZoom(fixedZoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Polyline for visual path
      L.polyline(path, { color: '#60a5fa', weight: 2, opacity: 0.8 }).addTo(map);

      // Marker icon
      const icon = L.divIcon({
        className: 'bg-transparent',
        html: `<div style="
            width:14px;height:14px;border-radius:9999px;
            background:linear-gradient(90deg,#06b6d4,#3b82f6);
            box-shadow:0 0 10px rgba(59,130,246,0.6);
            border:2px solid rgba(255,255,255,0.9);
          "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker(path[0], { icon }).addTo(map);
      markerRef.current = marker;

      // Make marker interactive: show a popup on click
      marker.bindPopup('<strong>Simulated activity</strong><br />Delivery route');

      // Subtle pulsing circle around marker
      const circle = L.circle(path[0], {
        radius: 25000,
        color: 'rgba(96,165,250,0.12)',
        fillColor: 'rgba(96,165,250,0.06)',
        weight: 1,
        interactive: false,
      }).addTo(map);
      circleRef.current = circle;

      // Animate marker movement along the path without panning the map (map stays centered & fixed zoom)
      let idx = 0;
      const stepMs = 900;
      const animate = () => {
        idx = (idx + 1) % path.length;
        const latlng = path[idx];
        marker.setLatLng(latlng);
        circle.setLatLng(latlng);
        animationRef.current = window.setTimeout(animate, stepMs);
      };

      animationRef.current = window.setTimeout(animate, stepMs);
    }).catch(() => {
      // silent fail if leaflet cannot be loaded in some environments
    });

    return () => {
      mounted = false;
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  const baseClass =
    "w-full md:w-2/5 h-72 md:h-[540px] bg-slate-50 p-4 flex items-center justify-center rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none";
  return (
    <div className={className ? className : baseClass}>
      <div ref={mapRef} className="w-full h-full rounded-2xl overflow-hidden shadow-inner" />
    </div>
  );
}

export default function SignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any>(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const SignInMutation = useMutation({
    mutationFn: handleSignIn,
    onSuccess: (data) => {
      Cookies.set("user_data", JSON.stringify(data), { expires: 7 });
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      router.push("/map");
    },
    onError: (error: any) => {
      setErrorMessage(error?.response?.data?.message ?? 'Sign in failed');
    },
  });

  const handleSubmission = (data: TSignInFormInputs): void => {
    setErrorMessage(null);
    SignInMutation.mutate(data);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Form first on mobile (order-1), but on md+ show form on the right (order-2) */}
        <div className="order-1 md:order-2 w-full md:w-3/5 bg-white p-6 md:p-10 flex flex-col justify-center rounded-b-3xl md:rounded-r-3xl">
          {/* Logo above form: centered on small screens, aligned right on md+ */}
          <div className="mb-4 flex items-center">
            <Image
              src={Logo}
              alt="Company Logo"
              width={100}
              height={56}
              className="h-auto mx-auto md:ml-auto"
            />
          </div>

          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Sign In</h1>
            <p className="text-sm text-gray-500 mt-1">Login to continue</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit(handleSubmission)}>
            <div>
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
              <BaseInput
                control={control}
                errors={errors}
                name="username"
                id="username"
                type="text"
                placeholder="Enter your username"
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <BaseInput
                  control={control}
                  errors={errors}
                  externalError={errorMessage}
                  name="password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full mt-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-2">
              {SignInMutation.isPending ? (
                <Circle className="animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>

        {/* Map second on mobile (so it appears below form); on md+ show map on the left */}
        <MapSimulation className="order-2 md:order-1 w-full md:w-3/5 h-72 md:h-[540px] bg-slate-50 p-4 flex items-center justify-center rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none" />
      </div>
    </div>
  );
}