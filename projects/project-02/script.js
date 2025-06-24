
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xffffff);
        document.getElementById('container').appendChild(renderer.domElement);

        // Sphere parameters
        const sphereRadius = 3;
        const particleCount = 5000;
        
        // Create geometry for particles
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        // Generate points on sphere surface using spherical coordinates
        for (let i = 0; i < particleCount; i++) {
            // Use uniform distribution on sphere surface
            const u = Math.random();
            const v = Math.random();
            
            // Convert to spherical coordinates
            const theta = 2 * Math.PI * u; // azimuthal angle
            const phi = Math.acos(2 * v - 1); // polar angle
            
            // Convert to Cartesian coordinates
            const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
            const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
            const z = sphereRadius * Math.cos(phi);
            
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            
            // Color based on position (creates gradient effect)
            const normalizedX = (x / sphereRadius + 1) / 2;
            const normalizedY = (y / sphereRadius + 1) / 2;
            const normalizedZ = (z / sphereRadius + 1) / 2;
            
            colors[i * 3] = normalizedX;     // red
            colors[i * 3 + 1] = normalizedY; // green
            colors[i * 3 + 2] = normalizedZ; // blue
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        // Create material for particles
        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        // Create particle system
        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
        
        // Camera position
        camera.position.z = 8;
        
        // Mouse controls
        let mouseX = 0;
        let mouseY = 0;
        let targetRotationX = 0;
        let targetRotationY = 0;
        let rotationX = 0;
        let rotationY = 0;
        
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - window.innerWidth / 2);
            mouseY = (event.clientY - window.innerHeight / 2);
            
            targetRotationX = mouseY * 0.002;
            targetRotationY = mouseX * 0.002;
        });
        
        // Zoom with mouse wheel
        document.addEventListener('wheel', (event) => {
            camera.position.z += event.deltaY * 0.01;
            camera.position.z = Math.max(3, Math.min(15, camera.position.z));
        });
        
        // Update particle count display
        document.getElementById('pointCount').textContent = particleCount.toLocaleString();
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Smooth rotation interpolation
            rotationX += (targetRotationX - rotationX) * 0.05;
            rotationY += (targetRotationY - rotationY) * 0.05;
            
            // Apply rotation to particle system
            particles.rotation.x = rotationX;
            particles.rotation.y = rotationY;
            
            // Automatic slow rotation when not interacting
            particles.rotation.z += 0.002;
            
            renderer.render(scene, camera);
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Start animation
        animate();
