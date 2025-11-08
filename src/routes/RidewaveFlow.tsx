import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const RideFlowDiagram = () => {
    const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});

    const toggleStep = (stepId: string) => {
        setExpandedSteps(prev => ({
            ...prev,
            [stepId]: !prev[stepId]
        }));
    };

    const flowSteps = [
        {
            id: 'step1',
            phase: 'Phase 1: Ride Request',
            title: '1. User Opens App & Searches for Ride',
            services: ['User App', 'API Gateway', 'User Service', 'Location Service'],
            details: [
                {
                    actor: 'User App',
                    actions: [
                        'User opens app (Socket.IO connection established)',
                        'Fetches user profile and preferences',
                        'Gets current location via GPS',
                        'Shows Google Maps with current location'
                    ]
                },
                {
                    actor: 'Location Service',
                    actions: [
                        'Receives user location',
                        'Converts to H3 index (resolution 8-9)',
                        'Stores in Redis: user:{userId}:location'
                    ]
                }
            ]
        },
        {
            id: 'step2',
            phase: 'Phase 1: Ride Request',
            title: '2. User Enters Pickup & Dropoff',
            services: ['User App', 'Google Maps API'],
            details: [
                {
                    actor: 'User App',
                    actions: [
                        'User types pickup location',
                        'Calls Google Places Autocomplete API',
                        'Displays suggestions',
                        'User selects pickup location',
                        'User types dropoff location',
                        'Calls Google Places Autocomplete API',
                        'User selects dropoff location'
                    ]
                },
                {
                    actor: 'Google Maps API',
                    actions: [
                        'Returns place predictions',
                        'Returns lat/lng for selected places',
                        'Calculates route between pickup/dropoff',
                        'Returns distance, duration, polyline'
                    ]
                }
            ]
        },
        {
            id: 'step3',
            phase: 'Phase 1: Ride Request',
            title: '3. Fare Estimation',
            services: ['User App', 'Matching Service', 'Location Service'],
            details: [
                {
                    actor: 'User App',
                    actions: [
                        'Sends request: POST /api/fare/estimate',
                        'Payload: {pickup, dropoff, vehicleType}'
                    ]
                },
                {
                    actor: 'Matching Service',
                    actions: [
                        'Calculates base fare from distance',
                        'Queries surge pricing from Redis',
                        'Checks H3 index for pickup location',
                        'Gets surge multiplier for that zone',
                        'Calculates: fare = baseFare × surgeMultiplier',
                        'Returns estimated fare + surge info'
                    ]
                }
            ]
        },
        {
            id: 'step4',
            phase: 'Phase 2: Matching',
            title: '4. User Confirms Ride Request',
            services: ['User App', 'Trip Service', 'Kafka'],
            details: [
                {
                    actor: 'User App',
                    actions: [
                        'User clicks "Request Ride"',
                        'POST /api/trips/request',
                        'Payload: {userId, pickup, dropoff, vehicleType, paymentMethod}'
                    ]
                },
                {
                    actor: 'Trip Service',
                    actions: [
                        'Creates trip record in PostgreSQL (status: requested)',
                        'Generates trip_uuid',
                        'Publishes to Kafka topic: ride.requests',
                        'Event: {type: RIDE_REQUESTED, tripId, userId, pickup, dropoff}',
                        'Returns tripId to user'
                    ]
                },
                {
                    actor: 'User App',
                    actions: [
                        'Shows "Finding driver..." screen',
                        'Listens to Socket.IO for trip updates'
                    ]
                }
            ]
        },
        {
            id: 'step5',
            phase: 'Phase 2: Matching',
            title: '5. Matching Service Finds Drivers',
            services: ['Matching Service', 'Location Service', 'Kafka', 'ScyllaDB'],
            details: [
                {
                    actor: 'Matching Service',
                    actions: [
                        'Consumes Kafka event: RIDE_REQUESTED',
                        'Extracts pickup location (lat, lng)',
                        'Converts to H3 index',
                        'Queries Location Service via gRPC: GetNearbyDrivers',
                        'Request: {h3Index, radius: 5km, vehicleType}'
                    ]
                },
                {
                    actor: 'Location Service',
                    actions: [
                        'Gets H3 neighbors (ring 1-3 for 5km radius)',
                        'Queries Redis: GEOSEARCH for each H3 zone',
                        'Filters: status=online, vehicleType matches',
                        'Returns list of driver IDs with locations + ETA'
                    ]
                },
                {
                    actor: 'Matching Service',
                    actions: [
                        'Receives candidate drivers (e.g., 15 drivers)',
                        'For each driver: Query Google Distance Matrix API',
                        'Gets accurate ETA considering traffic',
                        'Ranks drivers by: ETA, rating, acceptance rate',
                        'Stores in ScyllaDB: ride_requests, match_attempts',
                        'Selects top 3 drivers to offer'
                    ]
                }
            ]
        },
        {
            id: 'step6',
            phase: 'Phase 2: Matching',
            title: '6. Offer Ride to Drivers',
            services: ['Matching Service', 'Notification Service', 'Socket.IO'],
            details: [
                {
                    actor: 'Matching Service',
                    actions: [
                        'For first driver: Creates offer',
                        'Publishes to Kafka: ride.offers',
                        'Event: {type: RIDE_OFFER, tripId, driverId, pickup, fare, timeout: 15s}'
                    ]
                },
                {
                    actor: 'Notification Service',
                    actions: [
                        'Consumes Kafka event: RIDE_OFFER',
                        'Finds driver Socket.IO connection',
                        'Emits: socket.emit("ride:offer", {tripId, pickup, dropoff, fare, eta})',
                        'Sends push notification as backup',
                        'Stores notification in PostgreSQL'
                    ]
                },
                {
                    actor: 'Driver App',
                    actions: [
                        'Receives Socket.IO event',
                        'Shows ride offer popup with map',
                        'Plays notification sound',
                        'Shows 15-second countdown timer'
                    ]
                }
            ]
        },
        {
            id: 'step7',
            phase: 'Phase 2: Matching',
            title: '7. Driver Accepts/Rejects',
            services: ['Driver App', 'Trip Service', 'Kafka', 'Matching Service'],
            details: [
                {
                    actor: 'Driver App (Accept)',
                    actions: [
                        'Driver clicks "Accept"',
                        'POST /api/trips/{tripId}/accept',
                        'Payload: {driverId}'
                    ]
                },
                {
                    actor: 'Trip Service',
                    actions: [
                        'Updates trip: status=driver_assigned, driverId',
                        'Sets matched_at, accepted_at timestamps',
                        'Publishes to Kafka: ride.matches',
                        'Event: {type: RIDE_ACCEPTED, tripId, driverId, userId}'
                    ]
                },
                {
                    actor: 'Matching Service',
                    actions: [
                        'Cancels other pending offers',
                        'Updates ScyllaDB: match_attempts (response=accepted)',
                        'Marks driver as unavailable in cache'
                    ]
                },
                {
                    actor: 'Driver App (Reject)',
                    actions: [
                        'If timeout or rejection:',
                        'POST /api/trips/{tripId}/reject'
                    ]
                },
                {
                    actor: 'Matching Service',
                    actions: [
                        'Records rejection in ScyllaDB',
                        'Offers to next driver in queue',
                        'If all reject: Returns to step 5 (find more drivers)',
                        'After 3 attempts: Increases surge pricing'
                    ]
                }
            ]
        },
        {
            id: 'step8',
            phase: 'Phase 3: Trip Lifecycle',
            title: '8. Notify User - Driver Assigned',
            services: ['Notification Service', 'Socket.IO', 'User App'],
            details: [
                {
                    actor: 'Notification Service',
                    actions: [
                        'Consumes Kafka: RIDE_ACCEPTED',
                        'Fetches driver details from Driver Service',
                        'Emits to user Socket.IO: socket.emit("ride:matched", {driver, vehicle, eta})',
                        'Sends push notification',
                        'Stores notification in PostgreSQL'
                    ]
                },
                {
                    actor: 'User App',
                    actions: [
                        'Receives ride:matched event',
                        'Shows driver details: name, photo, rating, vehicle',
                        'Shows driver location on map',
                        'Displays ETA to pickup',
                        'Enables "Call Driver" and "Cancel" buttons'
                    ]
                }
            ]
        },
        {
            id: 'step9',
            phase: 'Phase 3: Trip Lifecycle',
            title: '9. Driver En Route to Pickup',
            services: ['Driver App', 'Location Service', 'Socket.IO'],
            details: [
                {
                    actor: 'Driver App',
                    actions: [
                        'Shows navigation to pickup location',
                        'Uses Google Directions API for route',
                        'Sends location updates every 3-5 seconds',
                        'POST /api/locations/update (or via gRPC)',
                        'Payload: {driverId, lat, lng, heading, speed}'
                    ]
                },
                {
                    actor: 'Location Service',
                    actions: [
                        'Receives location update',
                        'Converts to H3 index',
                        'Updates Redis: driver:{driverId}:location',
                        'Sets TTL: 30 seconds',
                        'Publishes to Kafka: driver.locations',
                        'Event: {driverId, lat, lng, tripId, timestamp}'
                    ]
                },
                {
                    actor: 'Trip Service',
                    actions: [
                        'Consumes driver.locations from Kafka',
                        'Filters: Only drivers on active trips',
                        'Stores waypoints in PostgreSQL: trip_waypoints',
                        'Calculates ETA to pickup',
                        'If near pickup (< 100m): Auto-triggers arrival'
                    ]
                },
                {
                    actor: 'User App',
                    actions: [
                        'Receives location updates via Socket.IO',
                        'Updates driver marker on map',
                        'Shows live ETA countdown',
                        'Updates route polyline'
                    ]
                }
            ]
        },
        {
            id: 'step10',
            phase: 'Phase 3: Trip Lifecycle',
            title: '10. Driver Arrives at Pickup',
            services: ['Driver App', 'Trip Service', 'Notification Service'],
            details: [
                {
                    actor: 'Driver App',
                    actions: [
                        'Driver clicks "I\'ve Arrived"',
                        'Or auto-detected by geofence (< 50m from pickup)',
                        'POST /api/trips/{tripId}/arrived'
                    ]
                },
                {
                    actor: 'Trip Service',
                    actions: [
                        'Updates trip: status=driver_arrived',
                        'Sets driver_arrived_at timestamp',
                        'Records event in trip_events',
                        'Publishes to Kafka: ride.events',
                        'Event: {type: DRIVER_ARRIVED, tripId, timestamp}'
                    ]
                },
                {
                    actor: 'Notification Service',
                    actions: [
                        'Sends to user: "Your driver has arrived"',
                        'Push + Socket.IO + SMS',
                        'Sends to driver: "Waiting for rider"'
                    ]
                },
                {
                    actor: 'User App',
                    actions: [
                        'Shows "Driver is here" notification',
                        'Enables "I\'m getting in" button',
                        'Shows waiting time counter'
                    ]
                }
            ]
        },
        {
            id: 'step11',
            phase: 'Phase 3: Trip Lifecycle',
            title: '11. Start Trip',
            services: ['Driver App', 'Trip Service', 'Location Service'],
            details: [
                {
                    actor: 'Driver App',
                    actions: [
                        'Rider gets in vehicle',
                        'Driver verifies OTP from user',
                        'Driver clicks "Start Trip"',
                        'POST /api/trips/{tripId}/start',
                        'Payload: {otp, startLat, startLng}'
                    ]
                },
                {
                    actor: 'Trip Service',
                    actions: [
                        'Validates OTP',
                        'Updates trip: status=started',
                        'Sets started_at timestamp',
                        'Records actual pickup location',
                        'Publishes to Kafka: {type: TRIP_STARTED}'
                    ]
                },
                {
                    actor: 'Location Service',
                    actions: [
                        'Starts high-frequency tracking',
                        'Location updates every 3 seconds',
                        'Stores route waypoints',
                        'Calculates live ETA to dropoff'
                    ]
                },
                {
                    actor: 'User App',
                    actions: [
                        'Shows "Trip in progress"',
                        'Displays live route on map',
                        'Shows live ETA to destination',
                        'Enables "Share Trip" and "Emergency SOS"'
                    ]
                }
            ]
        },
        {
            id: 'step12',
            phase: 'Phase 3: Trip Lifecycle',
            title: '12. During Trip - Live Tracking',
            services: ['All Services'],
            details: [
                {
                    actor: 'Driver App',
                    actions: [
                        'Continuous location updates (every 3s)',
                        'Shows navigation to dropoff',
                        'Can report issues or request help'
                    ]
                },
                {
                    actor: 'Location Service',
                    actions: [
                        'Stores all waypoints',
                        'Updates Redis with current position',
                        'Streams to Trip Service via Kafka'
                    ]
                },
                {
                    actor: 'Trip Service',
                    actions: [
                        'Tracks trip progress',
                        'Calculates actual distance traveled',
                        'Updates fare dynamically if needed',
                        'Monitors for route deviations',
                        'Detects if trip stopped > 5 min'
                    ]
                },
                {
                    actor: 'User App',
                    actions: [
                        'Receives location updates via Socket.IO',
                        'Shows real-time vehicle movement',
                        'Updates ETA continuously',
                        'Can share live location with contacts'
                    ]
                }
            ]
        },
        {
            id: 'step13',
            phase: 'Phase 4: Completion',
            title: '13. Complete Trip',
            services: ['Driver App', 'Trip Service', 'Payment Service'],
            details: [
                {
                    actor: 'Driver App',
                    actions: [
                        'Driver arrives at dropoff',
                        'Driver clicks "Complete Trip"',
                        'POST /api/trips/{tripId}/complete',
                        'Payload: {endLat, endLng, finalOdometerReading}'
                    ]
                },
                {
                    actor: 'Trip Service',
                    actions: [
                        'Updates trip: status=completed',
                        'Sets completed_at timestamp',
                        'Calculates final metrics:',
                        '  - actual_distance_km (from waypoints)',
                        '  - actual_duration_min',
                        'Calculates final fare:',
                        '  - baseFare + (distance × perKmRate) + (time × perMinRate)',
                        '  - Apply surge multiplier',
                        '  - Add taxes, subtract discounts',
                        'Stores in actual_fare field',
                        'Publishes to Kafka: {type: TRIP_COMPLETED, tripId, fare}'
                    ]
                },
                {
                    actor: 'Location Service',
                    actions: [
                        'Marks driver as available',
                        'Updates Redis: driver status = online',
                        'Stops high-frequency tracking'
                    ]
                }
            ]
        },
        {
            id: 'step14',
            phase: 'Phase 4: Completion',
            title: '14. Process Payment',
            services: ['Payment Service', 'Trip Service', 'Driver Service'],
            details: [
                {
                    actor: 'Payment Service',
                    actions: [
                        'Consumes Kafka: TRIP_COMPLETED',
                        'Fetches trip details from Trip Service',
                        'Gets final fare amount',
                        'Processes payment based on method:',
                        '  - Card: Charge via payment gateway',
                        '  - Wallet: Deduct from user wallet',
                        '  - Cash: Mark as cash collected',
                        'Creates payment record in PostgreSQL',
                        'Updates trip: payment_status=completed',
                        'Calculates driver earnings (fare - commission)',
                        'Publishes to Kafka: {type: PAYMENT_SUCCESS}'
                    ]
                },
                {
                    actor: 'Driver Service',
                    actions: [
                        'Consumes: PAYMENT_SUCCESS',
                        'Credits driver wallet',
                        'Updates driver earnings in driver_wallets',
                        'Creates earning record in driver_earnings',
                        'Updates driver statistics: total_trips, total_earnings'
                    ]
                }
            ]
        },
        {
            id: 'step15',
            phase: 'Phase 4: Completion',
            title: '15. Trip Summary & Rating',
            services: ['User App', 'Driver App', 'Trip Service', 'Notification Service'],
            details: [
                {
                    actor: 'Notification Service',
                    actions: [
                        'Sends to User: "Trip completed - ₹245"',
                        'Sends receipt via email',
                        'Sends to Driver: "Trip completed - You earned ₹185"'
                    ]
                },
                {
                    actor: 'User App',
                    actions: [
                        'Shows trip summary:',
                        '  - Route map with actual path',
                        '  - Distance, duration, fare breakdown',
                        '  - Payment method',
                        'Prompts for driver rating (1-5 stars)',
                        'Shows feedback options (tags)',
                        'POST /api/trips/{tripId}/rate',
                        'Payload: {rating, feedback, tags}'
                    ]
                },
                {
                    actor: 'Driver App',
                    actions: [
                        'Shows trip earnings',
                        'Prompts for user rating',
                        'Can add notes about the trip',
                        'POST /api/trips/{tripId}/rate-user'
                    ]
                },
                {
                    actor: 'Trip Service',
                    actions: [
                        'Stores ratings in trip_ratings table',
                        'Updates user and driver average ratings',
                        'Analyzes feedback for quality issues',
                        'Completes trip lifecycle'
                    ]
                }
            ]
        },
        {
            id: 'step16',
            phase: 'Phase 5: Post-Trip',
            title: '16. Analytics & ML Updates',
            services: ['Analytics Service', 'Matching Service'],
            details: [
                {
                    actor: 'Analytics Service',
                    actions: [
                        'Consumes all trip events from Kafka',
                        'Aggregates metrics:',
                        '  - Trips by region, time, vehicle type',
                        '  - Average wait time, trip duration',
                        '  - Revenue, driver earnings',
                        '  - Cancellation rates',
                        'Stores in time-series database',
                        'Updates ML models for:',
                        '  - Demand prediction',
                        '  - Surge pricing optimization',
                        '  - ETA accuracy',
                        '  - Driver supply forecasting'
                    ]
                },
                {
                    actor: 'Matching Service',
                    actions: [
                        'Updates H3 zone statistics',
                        'Adjusts surge multipliers based on:',
                        '  - Completed trips in last hour',
                        '  - Current active requests',
                        '  - Available driver count',
                        'Stores in ScyllaDB: surge_zones',
                        'Updates Redis cache for real-time pricing'
                    ]
                }
            ]
        }
    ];

    const specialFlows = [
        {
            id: 'cancel1',
            title: 'Cancellation Flow - User Cancels Before Match',
            details: [
                'User clicks "Cancel" on search screen',
                'POST /api/trips/{tripId}/cancel',
                'Trip Service: Updates status=cancelled',
                'Matching Service: Stops driver search',
                'No cancellation fee'
            ]
        },
        {
            id: 'cancel2',
            title: 'Cancellation Flow - User Cancels After Match',
            details: [
                'User clicks "Cancel" after driver assigned',
                'POST /api/trips/{tripId}/cancel',
                'Trip Service: Checks time since acceptance',
                'If < 2 min: No fee',
                'If > 2 min: Apply cancellation fee (₹20-50)',
                'Payment Service: Charges fee',
                'Notification: Notifies driver',
                'Driver becomes available again',
                'Updates cancellation_rate for user'
            ]
        },
        {
            id: 'cancel3',
            title: 'Cancellation Flow - Driver Cancels',
            details: [
                'Driver clicks "Cancel" with reason',
                'Trip Service: Updates status=cancelled',
                'Records driver cancellation',
                'Updates driver acceptance_rate (penalty)',
                'Matching Service: Restarts search',
                'User sees "Finding another driver"',
                'If 3+ cancellations: Driver suspended temporarily'
            ]
        }
    ];

    return (
        <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Complete Ride Flow: Request to Completion
                </h1>
                <p className="text-gray-600 mb-8">
                    Comprehensive flow for a ride-hailing platform using Node.js, Redis, ScyllaDB, PostgreSQL, Kafka, gRPC & Socket.IO
                </p>

                <div className="space-y-4">
                    {flowSteps.map((step) => (
                        <div key={step.id} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleStep(step.id)}
                                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-between hover:from-blue-600 hover:to-indigo-700 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    {expandedSteps[step.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                    <div className="text-left">
                                        <div className="text-xs font-semibold uppercase tracking-wide opacity-90">
                                            {step.phase}
                                        </div>
                                        <div className="text-lg font-bold">{step.title}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-wrap justify-end">
                                    {step.services.map((service, i) => (
                                        <span key={i} className="px-2 py-1 bg-white/20 rounded text-xs">
                                            {service}
                                        </span>
                                    ))}
                                </div>
                            </button>

                            {expandedSteps[step.id] && (
                                <div className="p-6 bg-gray-50">
                                    {step.details.map((detail, idx) => (
                                        <div key={idx} className="mb-6 last:mb-0">
                                            <h4 className="text-lg font-bold text-indigo-700 mb-3 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                                {detail.actor}
                                            </h4>
                                            <ul className="space-y-2 ml-4">
                                                {detail.actions.map((action, actionIdx) => (
                                                    <li key={actionIdx} className="flex items-start gap-2 text-gray-700">
                                                        <span className="text-indigo-400 mt-1">→</span>
                                                        <span className="flex-1">{action}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <span className="w-1 h-8 bg-red-500 rounded"></span>
                        Special Flows: Cancellations
                    </h2>
                    <div className="space-y-4">
                        {specialFlows.map((flow) => (
                            <div key={flow.id} className="border border-red-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => toggleStep(flow.id)}
                                    className="w-full px-6 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white flex items-center justify-between hover:from-red-600 hover:to-pink-700 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        {expandedSteps[flow.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                        <div className="text-lg font-bold">{flow.title}</div>
                                    </div>
                                </button>

                                {expandedSteps[flow.id] && (
                                    <div className="p-6 bg-red-50">
                                        <ul className="space-y-2">
                                            {flow.details.map((detail, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-gray-700">
                                                    <span className="text-red-400 mt-1">✖</span>
                                                    <span className="flex-1">{detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <h3 className="text-xl font-bold text-green-800 mb-4">Key Technologies Used</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded shadow-sm">
                            <div className="font-bold text-green-700">Redis + H3</div>
                            <div className="text-sm text-gray-600">Location Service - Fast geospatial queries</div>
                        </div>
                        <div className="bg-white p-4 rounded shadow-sm">
                            <div className="font-bold text-green-700">ScyllaDB</div>
                            <div className="text-sm text-gray-600">Matching Service - High-throughput matching</div>
                        </div>
                        <div className="bg-white p-4 rounded shadow-sm">
                            <div className="font-bold text-green-700">PostgreSQL</div>
                            <div className="text-sm text-gray-600">Trip/Notification - ACID transactions</div>
                        </div>
                        <div className="bg-white p-4 rounded shadow-sm">
                            <div className="font-bold text-green-700">Kafka</div>
                            <div className="text-sm text-gray-600">Event streaming between services</div>
                        </div>
                        <div className="bg-white p-4 rounded shadow-sm">
                            <div className="font-bold text-green-700">gRPC</div>
                            <div className="text-sm text-gray-600">Sync service-to-service communication</div>
                        </div>
                        <div className="bg-white p-4 rounded shadow-sm">
                            <div className="font-bold text-green-700">Socket.IO</div>
                            <div className="text-sm text-gray-600">Real-time updates to clients</div>
                        </div>
                        <div className="bg-white p-4 rounded shadow-sm">
                            <div className="font-bold text-green-700">Google Maps</div>
                            <div className="text-sm text-gray-600">Geocoding, routing, ETA calculation</div>
                        </div>
                        <div className="bg-white p-4 rounded shadow-sm">
                            <div className="font-bold text-green-700">Node.js + Bun</div>
                            <div className="text-sm text-gray-600">High-performance runtime</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RideFlowDiagram;