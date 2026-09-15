import { ModelPreset } from '../types';

export const PRESETS: ModelPreset[] = [
  {
    id: 'saas-system',
    name: 'SaaS Platform & Growth Dynamics',
    description: 'Bridges structural server infrastructure costs with dynamic viral acquisition loops and churn balancing.',
    nodes: [
      {
        id: 'n1',
        label: 'Marketing Budget',
        x: 180,
        y: 120,
        cost: 15000,
        value: 50,
        baselineValue: 50,
        tags: ['Growth', 'Finance'],
        notes: 'Monthly ad spend and campaign investments.'
      },
      {
        id: 'n2',
        label: 'User Acquisition Rate',
        x: 450,
        y: 120,
        cost: 0,
        value: 40,
        baselineValue: 40,
        tags: ['Growth'],
        notes: 'New signups per week.'
      },
      {
        id: 'n3',
        label: 'Active User Base',
        x: 720,
        y: 220,
        cost: 0,
        value: 60,
        baselineValue: 60,
        tags: ['Growth', 'Core'],
        notes: 'Total monthly active users on the platform.'
      },
      {
        id: 'n4',
        label: 'Word of Mouth Referrals',
        x: 450,
        y: 280,
        cost: 0,
        value: 30,
        baselineValue: 30,
        tags: ['Growth'],
        notes: 'Organic acquisition driven by existing happy users.'
      },
      {
        id: 'n5',
        label: 'Revenue Growth',
        x: 180,
        y: 350,
        cost: 0,
        value: 50,
        baselineValue: 50,
        tags: ['Finance'],
        notes: 'Monthly recurring revenue generated.'
      },
      {
        id: 'n6',
        label: 'Server Cluster Nodes',
        x: 720,
        y: 480,
        cost: 8500,
        value: 45,
        baselineValue: 45,
        tags: ['Infrastructure', 'Form'],
        notes: 'Cloud compute infrastructure cluster.'
      },
      {
        id: 'n7',
        label: 'Primary Database Cluster',
        x: 450,
        y: 480,
        cost: 4200,
        value: 55,
        baselineValue: 55,
        tags: ['Infrastructure', 'Form'],
        notes: 'Managed PostgreSQL cluster with failover replicas.'
      },
      {
        id: 'n8',
        label: 'System Latency',
        x: 450,
        y: 380,
        cost: 0,
        value: 20,
        baselineValue: 20,
        tags: ['Performance'],
        notes: 'Average API response latency in milliseconds.'
      },
      {
        id: 'n9',
        label: 'Customer Churn Rate',
        x: 720,
        y: 350,
        cost: 0,
        value: 15,
        baselineValue: 15,
        tags: ['Risk'],
        notes: 'Percentage of users canceling subscriptions.'
      }
    ],
    edges: [
      // Functional Causal Links (DOES / Dynamics)
      {
        id: 'e1',
        source: 'n1',
        target: 'n2',
        data: {
          category: 'functional',
          polarity: '+',
          delay: false,
          strength: 1.0,
          relationship: 'Drives'
        },
        curvature: 0
      },
      {
        id: 'e2',
        source: 'n2',
        target: 'n3',
        data: {
          category: 'functional',
          polarity: '+',
          delay: false,
          strength: 1.2,
          relationship: 'Increases'
        },
        curvature: 0
      },
      {
        id: 'e3',
        source: 'n3',
        target: 'n4',
        data: {
          category: 'functional',
          polarity: '+',
          delay: false,
          strength: 0.8,
          relationship: 'Generates'
        },
        curvature: 0.2
      },
      {
        id: 'e4',
        source: 'n4',
        target: 'n2',
        data: {
          category: 'functional',
          polarity: '+',
          delay: false,
          strength: 1.0,
          relationship: 'Boosts'
        },
        curvature: 0.2
      },
      {
        id: 'e5',
        source: 'n3',
        target: 'n5',
        data: {
          category: 'functional',
          polarity: '+',
          delay: false,
          strength: 1.5,
          relationship: 'Monetizes into'
        },
        curvature: 0
      },
      {
        id: 'e6',
        source: 'n5',
        target: 'n1',
        data: {
          category: 'functional',
          polarity: '+',
          delay: true,
          strength: 0.9,
          relationship: 'Reinvests in'
        },
        curvature: 0
      },
      {
        id: 'e7',
        source: 'n3',
        target: 'n8',
        data: {
          category: 'functional',
          polarity: '+',
          delay: false,
          strength: 1.1,
          relationship: 'Loads server cluster'
        },
        curvature: -0.2
      },
      {
        id: 'e8',
        source: 'n8',
        target: 'n9',
        data: {
          category: 'functional',
          polarity: '+',
          delay: false,
          strength: 1.3,
          relationship: 'Frustrates users'
        },
        curvature: 0
      },
      {
        id: 'e9',
        source: 'n9',
        target: 'n3',
        data: {
          category: 'functional',
          polarity: '-',
          delay: false,
          strength: 1.4,
          relationship: 'Reduces active user count'
        },
        curvature: -0.3
      },

      // Formal Links (IS / Physical Form & Dependency)
      {
        id: 'e10',
        source: 'n6',
        target: 'n7',
        data: {
          category: 'formal',
          cost: 1200,
          relationship: 'Queries data from'
        },
        curvature: 0
      },
      {
        id: 'e11',
        source: 'n6',
        target: 'n8',
        data: {
          category: 'formal',
          cost: 500,
          relationship: 'Hosts runtime for'
        },
        curvature: 0
      }
    ],
    presentationSteps: [
      {
        id: 'step1',
        title: '1. Dynamic Growth Loop (Reinforcing R1)',
        description: 'Marketing budget drives acquisition, expanding active users who generate word-of-mouth referrals and revenue to reinvest.',
        lens: 'functional',
        focusedNodeIds: ['n1', 'n2', 'n3', 'n4', 'n5']
      },
      {
        id: 'step2',
        title: '2. Infrastructure & Cost Structure (Formal IS)',
        description: 'Viewing the system through the Formal Lens reveals cloud compute and database clusters driving $28,900/month in baseline operational cost.',
        lens: 'formal',
        focusedNodeIds: ['n6', 'n7', 'n8']
      },
      {
        id: 'step3',
        title: '3. Emergence & Churn Counter-Loop (Balancing B1)',
        description: 'Unchecked user growth overloads infrastructure, increasing latency and triggering customer churn, counteracting revenue growth.',
        lens: 'emergence_map',
        focusedNodeIds: ['n3', 'n8', 'n9']
      }
    ]
  },
  {
    id: 'supply-chain',
    name: 'Supply Chain & Inventory Equilibrium',
    description: 'Models physical fulfillment centers and distribution fleets against dynamic customer order demand and stockout loops.',
    nodes: [
      {
        id: 'sc1',
        label: 'Regional Distribution Center',
        x: 200,
        y: 180,
        cost: 45000,
        value: 50,
        baselineValue: 50,
        tags: ['Facility', 'Form'],
        notes: 'Primary 100k sq ft automated warehouse.'
      },
      {
        id: 'sc2',
        label: 'Delivery Truck Fleet',
        x: 200,
        y: 420,
        cost: 22000,
        value: 60,
        baselineValue: 60,
        tags: ['Fleet', 'Form'],
        notes: 'Fleet of 25 electric delivery vans.'
      },
      {
        id: 'sc3',
        label: 'Order Volume',
        x: 500,
        y: 180,
        cost: 0,
        value: 55,
        baselineValue: 55,
        tags: ['Demand'],
        notes: 'Daily inbound customer orders.'
      },
      {
        id: 'sc4',
        label: 'Inventory Stock Level',
        x: 500,
        y: 300,
        cost: 0,
        value: 70,
        baselineValue: 70,
        tags: ['Inventory'],
        notes: 'On-hand finished goods inventory.'
      },
      {
        id: 'sc5',
        label: 'Stockout Frequency',
        x: 780,
        y: 300,
        cost: 0,
        value: 10,
        baselineValue: 10,
        tags: ['Performance'],
        notes: 'Items out of stock when customer orders.'
      },
      {
        id: 'sc6',
        label: 'Supplier Reorder Rate',
        x: 780,
        y: 180,
        cost: 0,
        value: 40,
        baselineValue: 40,
        tags: ['Supply'],
        notes: 'Restock orders dispatched to manufacturers.'
      }
    ],
    edges: [
      {
        id: 'sce1',
        source: 'sc1',
        target: 'sc2',
        data: {
          category: 'formal',
          cost: 3500,
          relationship: 'Dispatches logistics through'
        }
      },
      {
        id: 'sce2',
        source: 'sc3',
        target: 'sc4',
        data: {
          category: 'functional',
          polarity: '-',
          delay: false,
          strength: 1.2,
          relationship: 'Depletes'
        }
      },
      {
        id: 'sce3',
        source: 'sc4',
        target: 'sc5',
        data: {
          category: 'functional',
          polarity: '-',
          delay: false,
          strength: 1.5,
          relationship: 'Prevents'
        }
      },
      {
        id: 'sce4',
        source: 'sc5',
        target: 'sc6',
        data: {
          category: 'functional',
          polarity: '+',
          delay: true,
          strength: 1.1,
          relationship: 'Triggers emergency restock'
        }
      },
      {
        id: 'sce5',
        source: 'sc6',
        target: 'sc4',
        data: {
          category: 'functional',
          polarity: '+',
          delay: true,
          strength: 1.3,
          relationship: 'Replenishes'
        }
      },
      {
        id: 'sce6',
        source: 'sc5',
        target: 'sc3',
        data: {
          category: 'functional',
          polarity: '-',
          delay: false,
          strength: 1.0,
          relationship: 'Dampens customer demand'
        }
      }
    ],
    presentationSteps: [
      {
        id: 'scstep1',
        title: '1. Demand & Depletion Loop',
        description: 'Customer order volume drains warehouse stock levels.',
        lens: 'functional',
        focusedNodeIds: ['sc3', 'sc4']
      },
      {
        id: 'scstep2',
        title: '2. Balancing Reorder Loop (B1)',
        description: 'As inventory drops and stockouts rise, reorders trigger replenishment with supplier lead-time delay.',
        lens: 'emergence_map',
        focusedNodeIds: ['sc4', 'sc5', 'sc6']
      }
    ]
  },
  {
    id: 'empty',
    name: 'Blank Model',
    description: 'Start from a clean slate to model your own complex system.',
    nodes: [
      {
        id: 'b1',
        label: 'System Input Variable',
        x: 300,
        y: 250,
        cost: 1000,
        value: 50,
        baselineValue: 50,
        tags: ['Core']
      },
      {
        id: 'b2',
        label: 'System Outcome Variable',
        x: 600,
        y: 250,
        cost: 0,
        value: 50,
        baselineValue: 50,
        tags: ['Output']
      }
    ],
    edges: [
      {
        id: 'be1',
        source: 'b1',
        target: 'b2',
        data: {
          category: 'functional',
          polarity: '+',
          delay: false,
          strength: 1.0,
          relationship: 'Drives'
        }
      }
    ]
  }
];
