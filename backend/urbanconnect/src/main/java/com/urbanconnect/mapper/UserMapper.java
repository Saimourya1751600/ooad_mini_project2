package com.urbanconnect.mapper;

import com.urbanconnect.dto.UserDTO;
import com.urbanconnect.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring") // Makes it injectable via @Autowired
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserDTO toDTO(User user);
}
