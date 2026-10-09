'use strict';

// Presentation fixtures only. Never seed these into an authenticated user's storage.
// Replace this object (or call ProtoForgeDashboard.setData(response)) when an API exists.
window.ProtoForgeDashboardData = {
  demo: true,
  user: { name: 'Monfort', company: 'Monfort Innovations', email: 'monfort@example.com', phone: '919876543210', address: 'Coimbatore, Tamil Nadu', accountType: 'Business Client', memberSince: 'Jan 2026' },
  stats: { activeOrders: 3, pendingQuotes: 4, modelsUploaded: 12, completedPrints: 18 },
  projects: [
    { id: 'PF-PRJ-1024', name: 'Drone Camera Mount', material: 'PETG', technology: 'FDM', quantity: 4, status: 'Printing', progress: 65, created: '2026-10-02', image: 'application-drone-sm.webp', orderId: 'PF-ORD-2041' },
    { id: 'PF-PRJ-1025', name: 'Robotic Arm Joint', material: 'ABS', technology: 'FDM', quantity: 2, status: 'Quote Approved', progress: 35, created: '2026-10-03', image: 'application-mechanical-sm.webp', orderId: 'PF-ORD-2042' },
    { id: 'PF-PRJ-1026', name: 'Custom Gear Housing', material: 'Nylon PA12', technology: 'SLS', quantity: 8, status: 'Processing', progress: 45, created: '2026-10-04', image: 'application-functional-sm.webp', orderId: 'PF-ORD-2043' },
    { id: 'PF-PRJ-1027', name: 'Miniature Engine Prototype', material: 'Grey Resin', technology: 'SLA', quantity: 1, status: 'Completed', progress: 100, created: '2026-10-05', image: 'application-automotive-sm.webp' },
    { id: 'PF-PRJ-1028', name: 'IoT Sensor Enclosure', material: 'PLA+', technology: 'FDM', quantity: 10, status: 'Awaiting Quote', progress: 15, created: '2026-10-06', image: 'application-enclosure-sm.webp', quoteId: 'PF-QT-3101' },
    { id: 'PF-PRJ-1029', name: 'Precision Mounting Bracket', material: 'ABS', technology: 'FDM', quantity: 6, status: 'Processing', progress: 55, created: '2026-10-07', image: 'application-mechanical-sm.webp' }
  ],
  orders: [
    { id: 'PF-ORD-2041', name: 'Drone Camera Mount', projectId: 'PF-PRJ-1024', material: 'PETG', quantity: 4, amount: 3850, created: '2026-10-02', delivery: '2026-10-09', status: 'Printing', progress: 65 },
    { id: 'PF-ORD-2042', name: 'Robotic Arm Joint', projectId: 'PF-PRJ-1025', material: 'ABS', quantity: 2, amount: 5400, created: '2026-10-03', delivery: '2026-10-10', status: 'Quality Check', progress: 90 },
    { id: 'PF-ORD-2043', name: 'Custom Gear Housing', projectId: 'PF-PRJ-1026', material: 'Nylon PA12', quantity: 8, amount: 12750, created: '2026-10-04', delivery: '2026-10-12', status: 'Processing', progress: 30 }
  ],
  quotes: [
    { id: 'PF-QT-3101', name: 'IoT Sensor Enclosure', projectId: 'PF-PRJ-1028', material: 'PLA+', quantity: 10, amount: 6800, status: 'Pending Review' },
    { id: 'PF-QT-3102', name: 'Electric Motor Cover', material: 'ABS', quantity: 5, amount: 4500, status: 'Quote Ready' },
    { id: 'PF-QT-3103', name: 'Prototype Wheel Hub', material: 'Nylon PA12', quantity: 4, amount: 8950, status: 'Under Review' },
    { id: 'PF-QT-3104', name: 'Control Panel Knob', material: 'Black Resin', quantity: 20, amount: 7200, status: 'Pending Review' }
  ],
  models: [
    { id: 'PF-MDL-401', name: 'drone_mount_v3.stl', type: 'STL', size: '8.4 MB', uploadedAt: '2026-10-02', status: 'Ready', projectId: 'PF-PRJ-1024' },
    { id: 'PF-MDL-402', name: 'robot_arm_joint.stl', type: 'STL', size: '12.6 MB', uploadedAt: '2026-10-03', status: 'Ready', projectId: 'PF-PRJ-1025' },
    { id: 'PF-MDL-403', name: 'gear_housing_final.step', type: 'STEP', size: '5.2 MB', uploadedAt: '2026-10-04', status: 'Ready', projectId: 'PF-PRJ-1026' },
    { id: 'PF-MDL-404', name: 'engine_prototype.obj', type: 'OBJ', size: '24.8 MB', uploadedAt: '2026-10-05', status: 'Ready', projectId: 'PF-PRJ-1027' },
    { id: 'PF-MDL-405', name: 'iot_enclosure.stl', type: 'STL', size: '6.1 MB', uploadedAt: '2026-10-06', status: 'Ready', projectId: 'PF-PRJ-1028' },
    { id: 'PF-MDL-406', name: 'motor_cover.step', type: 'STEP', size: '4.7 MB', uploadedAt: '2026-10-06', status: 'Ready' },
    { id: 'PF-MDL-407', name: 'wheel_hub_v2.stl', type: 'STL', size: '9.3 MB', uploadedAt: '2026-10-06', status: 'Ready' },
    { id: 'PF-MDL-408', name: 'control_knob.stl', type: 'STL', size: '2.8 MB', uploadedAt: '2026-10-06', status: 'Ready' },
    { id: 'PF-MDL-409', name: 'camera_bracket.stl', type: 'STL', size: '3.5 MB', uploadedAt: '2026-10-01', status: 'Ready' },
    { id: 'PF-MDL-410', name: 'prototype_clip.stl', type: 'STL', size: '1.2 MB', uploadedAt: '2026-10-01', status: 'Ready' },
    { id: 'PF-MDL-411', name: 'mounting_plate.step', type: 'STEP', size: '6.9 MB', uploadedAt: '2026-09-30', status: 'Ready' },
    { id: 'PF-MDL-412', name: 'fan_duct.stl', type: 'STL', size: '7.6 MB', uploadedAt: '2026-09-29', status: 'Ready' }
  ],
  completed: [
    { id: 'PF-ORD-2021', name: 'Gearbox Cover', status: 'Completed', completedAt: '2026-09-28', progress: 100 },
    { id: 'PF-ORD-2022', name: 'Sensor Housing', status: 'Completed', completedAt: '2026-09-29', progress: 100 },
    { id: 'PF-ORD-2023', name: 'PCB Enclosure', status: 'Completed', completedAt: '2026-09-30', progress: 100 }
  ],
  materials: [
    { name: 'PLA+', technology: 'FDM', feature: 'Easy Print', strength: 'Medium', finish: 'Smooth', use: 'Concept models and fit checks', slug: 'pla', image: 'material-pla-sm.webp' },
    { name: 'PETG', technology: 'FDM', feature: 'Durable', strength: 'High', finish: 'Smooth', use: 'Mechanical and functional prototypes', slug: 'petg', image: 'material-petg-sm.webp' },
    { name: 'ABS', technology: 'FDM', feature: 'Heat Resistant', strength: 'High', finish: 'Matte', use: 'Enclosures and durable housings', slug: 'abs', image: 'material-abs-sm.webp' },
    { name: 'Nylon PA12', technology: 'SLS', feature: 'Engineering Grade', strength: 'High', finish: 'Fine-grain matte', use: 'Gears, joints and functional assemblies', slug: 'nylon', image: 'material-nylon-sm.webp' },
    { name: 'Grey Resin', technology: 'SLA', feature: 'High Detail', strength: 'Medium', finish: 'Smooth', use: 'Detailed miniatures and visual prototypes', slug: 'resin', image: 'material-resin-sm.webp' },
    { name: 'Tough Resin', technology: 'SLA', feature: 'Functional Prototype', strength: 'High', finish: 'Smooth', use: 'Snap-fit parts and assembly trials', slug: 'resin', image: 'material-resin-sm.webp' }
  ],
  notifications: [
    { id: 'PF-N-1', title: 'Quote Ready', message: 'Your quote for IoT Sensor Enclosure is ready for review.', time: '10 minutes ago', unread: true, page: 'quotes', detail: 'PF-QT-3101' },
    { id: 'PF-N-2', title: 'Printing Started', message: 'Printing has started for Drone Camera Mount.', time: '1 hour ago', unread: true, page: 'orders', detail: 'PF-ORD-2041' },
    { id: 'PF-N-3', title: 'Order Update', message: 'Robotic Arm Joint has moved to Quality Check.', time: '3 hours ago', unread: true, page: 'orders', detail: 'PF-ORD-2042' },
    { id: 'PF-N-4', title: 'Print Completed', message: 'Miniature Engine Prototype has been completed successfully.', time: 'Yesterday', unread: false, page: 'client-dashboard', detail: 'PF-PRJ-1027' },
    { id: 'PF-N-5', title: 'Model Analysis Complete', message: 'gear_housing_final.step is ready for quotation.', time: 'Yesterday', unread: false, page: 'models', detail: 'PF-MDL-403' }
  ],
  billing: { outstanding: 5400, totalSpent: 48750, invoices: 8, paymentMethod: 'Visa ending 4242' },
  payments: [
    { id: 'PF-PAY-5011', name: 'Drone Camera Mount', amount: 3850, status: 'Paid' },
    { id: 'PF-PAY-5010', name: 'Control Knob Prototype', amount: 7200, status: 'Paid' },
    { id: 'PF-PAY-5009', name: 'Gearbox Prototype', amount: 9500, status: 'Paid' }
  ],
  activities: [
    { message: 'Drone Camera Mount moved to Printing.', time: 'Today · 1 hour ago', page: 'orders', detail: 'PF-ORD-2041' },
    { message: 'IoT Sensor Enclosure quote generated.', time: 'Today · 3 hours ago', page: 'quotes', detail: 'PF-QT-3101' },
    { message: 'Robotic Arm Joint payment confirmed.', time: 'Yesterday', page: 'orders', detail: 'PF-ORD-2042' },
    { message: 'Miniature Engine Prototype completed.', time: 'Yesterday', page: 'client-dashboard', detail: 'PF-PRJ-1027' }
  ]
};
