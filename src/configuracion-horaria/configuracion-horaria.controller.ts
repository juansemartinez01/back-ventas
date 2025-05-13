import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ConfiguracionHorariaService } from './configuracion-horaria.service';
import { CreateConfiguracionHorariaDto } from './dto/create-configuracion-horaria.dto';
import { UpdateConfiguracionHorariaDto } from './dto/update-configuracion-horaria.dto';
import { ConfiguracionHoraria } from './configuracion-horaria.entity';

@Controller('configuracion-horaria')
export class ConfiguracionHorariaController {
  constructor(private readonly service: ConfiguracionHorariaService) {}

  @Get()
  getAll(): Promise<ConfiguracionHoraria[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<ConfiguracionHoraria> {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateConfiguracionHorariaDto): Promise<ConfiguracionHoraria> {
    return this.service.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateConfiguracionHorariaDto,
  ): Promise<ConfiguracionHoraria> {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }
}