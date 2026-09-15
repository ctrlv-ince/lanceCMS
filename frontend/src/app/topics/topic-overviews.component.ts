import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon.component';
import { Cpu3dComponent } from './visual-components';
import { RevealDirective, TiltDirective } from './visual-behavior.directive';
import { TOPIC_LEARNING } from './topic-learning-data';

@Component({
  selector: 'app-topic-overviews', standalone: true,
  imports: [RouterLink, IconComponent, Cpu3dComponent, RevealDirective, TiltDirective],
  templateUrl: './topic-overviews.component.html',
  styleUrl: './topic-overviews.component.css',
})
export class TopicOverviewsComponent {
  cards = [
    {
      slug: 'microprocessor-history', title: 'Microprocessor History', theme: 'history', chip: 'CPU EVOLUTION', cores: 4,
      description: 'A brief journey from early processors to modern multi-core CPUs. Explore the major generations, key developments, and how microprocessors evolved over time.',
      features: ['Timeline', 'Key Generations', 'Modern CPUs'], modules: [],
    },
    {
      slug: 'sap-1', title: 'SAP-1 Overview', theme: 'sap1', chip: 'SAP-1', cores: 1,
      description: 'A quick visual explanation of how SAP-1 stores instructions, processes data, performs arithmetic, and produces output.',
      features: ['Architecture', 'Instruction Set', 'How It Works'], modules: ['RAM', 'A / B', 'DATA BUS', '0000 1000'],
    },
    {
      slug: 'sap-2', title: 'SAP-2 Overview', theme: 'sap2', chip: 'SAP-2', cores: 1,
      description: 'A more advanced computer architecture with additional registers, I/O ports, flags, branching, logic operations, and a richer instruction set.',
      features: ['Architecture', 'Instruction Groups', 'Key Features'], modules: ['MEM / MDR', 'I/O PORTS', 'ALU', 'S / Z FLAGS'],
    },
  ].map(card => ({...card, learning: TOPIC_LEARNING[card.slug]}));
}
